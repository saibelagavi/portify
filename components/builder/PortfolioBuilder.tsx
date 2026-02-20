'use client'

import { useState } from 'react'
import { Code2, FolderOpen, Briefcase, GraduationCap } from 'lucide-react'
import { SkillsSection } from './SkillsSection'
import { ProjectsSection } from './ProjectsSection'
import { ExperienceSection } from './ExperienceSection'
import { EducationSection } from './EducationSection'
import type { Skill, Project, Experience, Education } from '@/types'

interface Props {
  initialSkills: Skill[]
  initialProjects: Project[]
  initialExperiences: Experience[]
  initialEducation: Education[]
}

const TABS = [
  { id: 'skills', label: 'Skills', icon: Code2, color: 'rgba(139,92,246,0.15)', activeColor: 'rgba(139,92,246,0.25)', borderActive: 'rgba(139,92,246,0.5)' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, color: 'rgba(34,211,238,0.1)', activeColor: 'rgba(34,211,238,0.2)', borderActive: 'rgba(34,211,238,0.4)' },
  { id: 'experience', label: 'Experience', icon: Briefcase, color: 'rgba(244,114,182,0.1)', activeColor: 'rgba(244,114,182,0.2)', borderActive: 'rgba(244,114,182,0.4)' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'rgba(234,179,8,0.1)', activeColor: 'rgba(234,179,8,0.15)', borderActive: 'rgba(234,179,8,0.4)' },
]

export function PortfolioBuilder({ initialSkills, initialProjects, initialExperiences, initialEducation }: Props) {
  const [activeTab, setActiveTab] = useState<string>('skills')

  const activeTabData = TABS.find((t) => t.id === activeTab)!

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 border"
              style={{
                background: isActive ? tab.activeColor : 'rgba(255,255,255,0.03)',
                borderColor: isActive ? tab.borderActive : 'rgba(255,255,255,0.08)',
                color: isActive ? '#f8fafc' : '#94a3b8',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div key={activeTab}>
        {activeTab === 'skills' && <SkillsSection initialSkills={initialSkills} />}
        {activeTab === 'projects' && <ProjectsSection initialProjects={initialProjects} />}
        {activeTab === 'experience' && <ExperienceSection initialExperiences={initialExperiences} />}
        {activeTab === 'education' && <EducationSection initialEducation={initialEducation} />}
      </div>
    </div>
  )
}
