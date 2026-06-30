// components/schedule/WeeklyGrid.tsx
'use client'
import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import type { Task, SlotCoords } from '@/types'
import { copyTaskToSlot, createTask } from '@/lib/tasks'
import TaskCard from './TaskCard'
import SlotModal from './SlotModal'

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const SLOTS = Array.from({ length: 8 }, (_, i) => i)

interface Props {
  studentId: string
  initialTasks: Task[]
}

export default function WeeklyGrid({ studentId, initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [openSlot, setOpenSlot] = useState<SlotCoords | null>(null)

  // Build a lookup map: "day-slot" → Task
  const taskMap = Object.fromEntries(
    tasks.map(t => [`${t.day_of_week}-${t.slot_index}`, t])
  )

  // ── Drag handlers ────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  async function handleDragEnd({ over }: DragEndEvent) {
    if (!over || !activeTask) { setActiveTask(null); return }

    const [day, slot] = (over.id as string).split('-').map(Number)
    const isOccupied = !!taskMap[`${day}-${slot}`]

    if (!isOccupied && (day !== activeTask.day_of_week || slot !== activeTask.slot_index)) {
      // COPY-ON-DROP: original stays, new record is inserted
      const copied = await copyTaskToSlot(activeTask, { day, slot })
      setTasks(prev => [...prev, copied])
    }
    setActiveTask(null)
  }

  // ── Slot click (empty slot opens modal) ──────────────────────
  function handleSlotClick(coords: SlotCoords) {
    if (!taskMap[`${coords.day}-${coords.slot}`]) {
      setOpenSlot(coords)
    }
  }

  async function handleTaskCreate(values: Parameters<typeof createTask>[2]) {
    if (!openSlot) return
    const task = await createTask(studentId, openSlot, values)
    setTasks(prev => [...prev, task])
    setOpenSlot(null)
  }

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[700px]">
            {/* Header row */}
            <div className="h-8" /> {/* slot-number column */}
            {DAYS.map(d => (
              <div key={d} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
                {d}
              </div>
            ))}

            {/* Slot rows */}
            {SLOTS.map(slot => (
              <>
                <div key={`lbl-${slot}`} className="flex items-center justify-center text-xs text-gray-300 font-mono">
                  {slot + 1}
                </div>
                {DAYS.map((_, day) => {
                  const task = taskMap[`${day}-${slot}`]
                  return (
                    <DroppableCell
                      key={`${day}-${slot}`}
                      id={`${day}-${slot}`}
                      onClick={() => handleSlotClick({ day, slot })}
                    >
                      {task ? <DraggableTask task={task} /> : null}
                    </DroppableCell>
                  )
                })}
              </>
            ))}
          </div>
        </div>

        {/* Ghost card shown while dragging */}
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      {/* Create task modal */}
      {openSlot && (
        <SlotModal
          onConfirm={handleTaskCreate}
          onClose={() => setOpenSlot(null)}
        />
      )}
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────

function DroppableCell({
  id, children, onClick,
}: { id: string; children: React.ReactNode; onClick: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`min-h-[72px] rounded-lg border transition-colors cursor-pointer
        ${isOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 hover:border-gray-300'}
        ${!children ? 'hover:bg-gray-50' : ''}`}
    >
      {children}
    </div>
  )
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={isDragging ? 'opacity-40' : ''}>
      <TaskCard task={task} />
    </div>
  )
}
