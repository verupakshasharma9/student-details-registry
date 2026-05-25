import React from 'react';
import { 
  GraduationCap, 
  Users, 
  PlusCircle, 
  SlidersHorizontal,
  Info,
  HelpCircle
} from 'lucide-react';

/**
 * Shared Layout container featuring a sidebar-dashboard navigation system,
 * modern typography, active tab styles, and primary content injection area.
 * 
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ('students' or 'about')
 * @param {Function} props.setActiveTab - Trigger to switch active tabs
 * @param {Function} props.onAddStudentClick - Primary action trigger to open create student form modal
 * @param {React.ReactNode} props.children - Dashboard main contents
 */
export default function Layout({ 
  activeTab, 
  setActiveTab, 
  onAddStudentClick, 
  children 
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 bg-slate-950">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-wider uppercase text-slate-100">UniRegistry</h1>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Student Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
              activeTab === 'about'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Info className="h-5 w-5" />
            <span>About Registry</span>
          </button>
        </nav>

        {/* Sidebar Footer Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onAddStudentClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-emerald-500/10 transition-all duration-150"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="flex items-center gap-4 md:gap-0">
            {/* Logo placeholder for Mobile screens */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="p-1.5 bg-indigo-600 rounded text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-950 tracking-wider">UniRegistry</span>
            </div>
            <h2 className="hidden md:block text-xl font-bold text-slate-800 tracking-tight">
              {activeTab === 'students' ? 'Student Registry Dashboard' : 'About Registry Management'}
            </h2>
          </div>

          {/* Action on Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onAddStudentClick}
              className="md:hidden flex items-center justify-center p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 shadow"
              title="Add Student"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 text-slate-500 text-sm border-l pl-3 md:pl-0 border-slate-200 md:border-l-0">
              <span className="font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs">
                Admin Panel v1.0
              </span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
