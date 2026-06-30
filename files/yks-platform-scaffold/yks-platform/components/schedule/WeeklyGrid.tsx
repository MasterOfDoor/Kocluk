// components/schedule/WeeklyGrid.tsx
'use client'
import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import type { Task, SlotCoords } from '@/types'
import { copyTaskToSlot, createTask, updateTask, deleteTask } from '@/lib/tasks'
import TaskCard from './TaskCard'
import SlotModal from './SlotModal'

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const SLOTS = Array.from({ length: 8 }, (_, i) => i)

interface Props {
  studentId: string
  initialTasks: Task[]
  readOnly?: boolean
}

export default function WeeklyGrid({ studentId, initialTasks, readOnly = false }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  // Modals state
  const [openSlot, setOpenSlot] = useState<SlotCoords | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, task: Task } | null>(null)

  useEffect(() => {
    function handleClick() {
      if (contextMenu) setContextMenu(null)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [contextMenu])

  // Build a lookup map: "day-slot" → Task
  const taskMap = Object.fromEntries(
    tasks.map(t => [`${t.day_of_week}-${t.slot_index}`, t])
  )

  // Math
  const totalWeekHours = tasks.reduce((sum, t) => sum + t.duration_hours, 0)
  const dailyHours = Array(7).fill(0)
  tasks.forEach(t => { dailyHours[t.day_of_week] += t.duration_hours })

  // ── Drag handlers ────────────────────────────────────────────
  function handleDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
    setContextMenu(null)
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

  // ── Context Menu Handlers ────────────────────────────────────
  function handleContextMenu(e: React.MouseEvent, task: Task) {
    if (readOnly) return
    e.preventDefault()
    setContextMenu({ x: e.pageX, y: e.pageY, task })
  }

  async function handleDeleteTask(task: Task) {
    try {
      await deleteTask(task.id)
      setTasks(prev => prev.filter(t => t.id !== task.id))
    } catch (e) {
      console.error(e)
      alert("Görev silinirken hata oluştu.")
    }
  }

  // ── Slot & Task Creation / Update ────────────────────────────
  function handleSlotClick(coords: SlotCoords) {
    if (readOnly) return
    if (!taskMap[`${coords.day}-${coords.slot}`]) {
      setOpenSlot(coords)
    }
  }

  async function handleTaskCreate(values: Parameters<typeof createTask>[2]) {
    if (!openSlot) return
    try {
      const task = await createTask(studentId, openSlot, values)
      setTasks(prev => [...prev, task])
      setOpenSlot(null)
    } catch (e) {
      console.error(e)
    }
  }
  
  async function handleTaskEdit(values: Parameters<typeof createTask>[2]) {
    if (!editingTask) return
    try {
      const updated = await updateTask(editingTask.id, values)
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      setEditingTask(null)
    } catch (e) {
      console.error(e)
    }
  }

  // Grid renderer helper
  const renderHeaders = () => (
    <>
      <div className="h-16 flex flex-col items-center justify-center bg-indigo-50/50 rounded-tl-xl border-b border-r border-indigo-100">
        <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Haftalık</span>
        <span className="text-lg font-bold text-indigo-600">{totalWeekHours}s</span>
      </div>
      {DAYS.map((d, i) => (
        <div key={d} className="h-16 flex flex-col items-center justify-center bg-gray-50/50 border-b border-gray-100 last:rounded-tr-xl">
          <span className="text-sm font-bold text-gray-700">{d}</span>
          <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-full shadow-sm mt-1">{dailyHours[i]}s</span>
        </div>
      ))}
    </>
  )

  if (readOnly) {
    return (
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-8 gap-2 min-w-[800px]">
          {renderHeaders()}
          {SLOTS.map(slot => (
            <>
              <div key={`lbl-${slot}`} className="flex items-center justify-center text-xs text-gray-400 font-mono bg-gray-50/30 rounded-lg">
                {slot + 1}
              </div>
              {DAYS.map((_, day) => {
                const task = taskMap[`${day}-${slot}`]
                return (
                  <div key={`${day}-${slot}`} className="min-h-[85px] rounded-xl border border-gray-100/80 p-0.5 bg-gray-50/10">
                    {task && <TaskCard task={task} />}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-2 min-w-[800px]">
              {renderHeaders()}
              
              {SLOTS.map(slot => (
                <>
                  <div key={`lbl-${slot}`} className="flex items-center justify-center text-xs text-gray-400 font-mono bg-gray-50/30 rounded-lg">
                    {slot + 1}
                  </div>
                  {DAYS.map((_, day) => {
                    const task = taskMap[`${day}-${slot}`]
                    return (
                      <DroppableCell key={`${day}-${slot}`} id={`${day}-${slot}`} onClick={() => handleSlotClick({ day, slot })}>
                        {task ? <DraggableTask task={task} onContextMenu={(e) => handleContextMenu(e, task)} /> : null}
                      </DroppableCell>
                    )
                  })}
                </>
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>
        
        {/* Context Menu UI */}
        {contextMenu && (
          <div 
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 w-48 animate-in fade-in zoom-in duration-150"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
              Görev İşlemleri
            </div>
            <button 
              onClick={() => { setEditingTask(contextMenu.task); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              ✏️ Düzenle
            </button>
            <button 
              onClick={() => { handleDeleteTask(contextMenu.task); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              🗑️ Sil
            </button>
          </div>
        )}
      </div>

      {openSlot && (
        <SlotModal onConfirm={handleTaskCreate} onClose={() => setOpenSlot(null)} />
      )}
      
      {editingTask && (
        <SlotModal 
          initialData={{
            title: editingTask.title,
            category: editingTask.category,
            content: editingTask.content ?? '',
            duration_hours: editingTask.duration_hours
          }}
          onConfirm={handleTaskEdit} 
          onClose={() => setEditingTask(null)} 
        />
      )}
    </>
  )
}

function DroppableCell({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`min-h-[85px] rounded-xl border-2 transition-all cursor-pointer
        ${isOver ? 'border-indigo-400 bg-indigo-50/50 scale-105 z-10' : 'border-dashed border-gray-100 hover:border-indigo-200'}
        ${!children ? 'hover:bg-indigo-50/30' : 'border-transparent hover:border-transparent'}`}
    >
      {children}
    </div>
  )
}

function DraggableTask({ task, onContextMenu }: { task: Task, onContextMenu: (e: React.MouseEvent) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={isDragging ? 'opacity-0' : 'h-full'}>
      <TaskCard task={task} onContextMenu={onContextMenu} />
    </div>
  )
}
