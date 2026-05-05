'use client'

import { useState } from 'react'
import { DirectorySearchFilters } from '@/lib/database/directory-types'

interface SearchFiltersProps {
  filters: DirectorySearchFilters
  onFilterChange: (filters: DirectorySearchFilters) => void
  onClearFilters: () => void
}

const SPECIALTIES = [
  'Anesthesiology',
  'Physical Medicine & Rehabilitation',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Psychiatry',
  'Rheumatology',
  'Primary Care',
  'Neurosurgery'
]

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Brazil',
  'Argentina',
  'Mexico',
  'Chile',
  'Colombia',
  'India',
  'Japan',
  'China',
  'Singapore',
  'Malaysia',
  'South Africa',
  'Egypt',
  'Nigeria',
  'Kenya'
]

const AREAS_OF_INTEREST = [
  'Medical Education & Workforce Development',
  'Collaborative Research & International Partnerships',
  'Consensus Building & Guideline Development',
  'Rehabilitation & Functional Restoration',
  'Neuropathic & Complex Pain',
  'Pain Research & Clinical Trials',
  'Chronic Pain Management',
  'Acute Pain Management',
  'Cancer Pain',
  'Interventional Pain Management',
  'Palliative Care',
  'Pediatric Pain',
  'Geriatric Pain',
  'Headache Medicine',
  'Musculoskeletal Pain'
]

export default function SearchFilters({ filters, onFilterChange, onClearFilters }: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    specialty: true,
    location: true,
    institution: false,
    areas: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilter = (key: keyof DirectorySearchFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="bg-surface border border-border rounded-[10px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-text">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-[12px] text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Specialty */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('specialty')}
          className="w-full flex items-center justify-between text-left font-semibold text-[13px] text-text mb-2"
        >
          <span>Specialty</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform text-text-muted ${expandedSections.specialty ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.specialty && (
          <div className="space-y-2">
            <select
              value={filters.specialty || ''}
              onChange={(e) => updateFilter('specialty', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[13px] text-text focus:outline-none focus:border-blue-400"
            >
              <option value="">All specialties</option>
              {SPECIALTIES.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between text-left font-semibold text-[13px] text-text mb-2"
        >
          <span>Location</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform text-text-muted ${expandedSections.location ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.location && (
          <div className="space-y-2">
            <select
              value={filters.location || ''}
              onChange={(e) => updateFilter('location', e.target.value || undefined)}
              className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[13px] text-text focus:outline-none focus:border-blue-400"
            >
              <option value="">All locations</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Institution */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('institution')}
          className="w-full flex items-center justify-between text-left font-semibold text-[13px] text-text mb-2"
        >
          <span>Institution</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform text-text-muted ${expandedSections.institution ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.institution && (
          <div className="space-y-2">
            <input
              type="text"
              value={filters.institution || ''}
              onChange={(e) => updateFilter('institution', e.target.value || undefined)}
              placeholder="Search institution..."
              className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[13px] text-text focus:outline-none focus:border-blue-400"
            />
          </div>
        )}
      </div>

      {/* Areas of Interest */}
      <div className="mb-5">
        <button
          onClick={() => toggleSection('areas')}
          className="w-full flex items-center justify-between text-left font-semibold text-[13px] text-text mb-2"
        >
          <span>Areas of Interest</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform text-text-muted ${expandedSections.areas ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.areas && (
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {AREAS_OF_INTEREST.map(area => (
              <label key={area} className="flex items-center cursor-pointer hover:bg-bg/50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.areas_of_interest?.includes(area) || false}
                  onChange={(e) => {
                    const currentAreas = filters.areas_of_interest || []
                    const newAreas = e.target.checked
                      ? [...currentAreas, area]
                      : currentAreas.filter(a => a !== area)
                    updateFilter('areas_of_interest', newAreas.length > 0 ? newAreas : undefined)
                  }}
                  className="h-3.5 w-3.5 text-blue-600 accent-blue-600 border-border rounded"
                />
                <span className="ml-2 text-[12px] text-text-muted">{area}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block font-semibold text-[13px] text-text mb-2">
          Status
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => updateFilter('status', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-bg border border-border rounded-md text-[13px] text-text focus:outline-none focus:border-blue-400"
        >
          <option value="">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <p className="text-[12px] font-semibold text-text mb-2">Active Filters:</p>
          <div className="space-y-1">
            {filters.specialty && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Specialty: {filters.specialty}</span>
                <button
                  onClick={() => updateFilter('specialty', undefined)}
                  className="text-c1 hover:text-c1/80 font-medium"
                >
                  ×
                </button>
              </div>
            )}
            {filters.location && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Location: {filters.location}</span>
                <button
                  onClick={() => updateFilter('location', undefined)}
                  className="text-c1 hover:text-c1/80 font-medium"
                >
                  ×
                </button>
              </div>
            )}
            {filters.institution && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Institution: {filters.institution}</span>
                <button
                  onClick={() => updateFilter('institution', undefined)}
                  className="text-c1 hover:text-c1/80 font-medium"
                >
                  ×
                </button>
              </div>
            )}
            {filters.areas_of_interest && filters.areas_of_interest.length > 0 && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Areas: {filters.areas_of_interest.length} selected</span>
                <button
                  onClick={() => updateFilter('areas_of_interest', undefined)}
                  className="text-c1 hover:text-c1/80 font-medium"
                >
                  ×
                </button>
              </div>
            )}
            {filters.status && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Status: {filters.status}</span>
                <button
                  onClick={() => updateFilter('status', undefined)}
                  className="text-c1 hover:text-c1/80 font-medium"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
