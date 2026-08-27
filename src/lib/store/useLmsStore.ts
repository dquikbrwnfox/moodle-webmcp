import { useState, useEffect } from 'react';
import { lmsClient } from '../lms/lmsClient';
import { webmcpRegistry } from '../webmcp/registry';
import { Course, Assignment, Persona } from '../../types/lms';

export function useLmsStore() {
  const [persona, setPersonaState] = useState<Persona>(lmsClient.getActivePersona());
  const [courses, setCourses] = useState<Course[]>(lmsClient.getCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(lmsClient.getAssignments());
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'deadlines' | 'forums' | 'evaluator'>('courses');

  useEffect(() => {
    webmcpRegistry.init();
  }, []);

  const switchPersona = (personaId: string) => {
    const updated = lmsClient.setPersona(personaId);
    setPersonaState({ ...updated });
    webmcpRegistry.syncToolsForRole(updated.role);
    setCourses([...lmsClient.getCourses()]);
    setAssignments([...lmsClient.getAssignments()]);
  };

  const selectCourse = (courseId: number | null) => {
    setSelectedCourseId(courseId);
  };

  const selectAssignment = (assignmentId: number | null) => {
    setSelectedAssignmentId(assignmentId);
  };

  const refreshData = () => {
    setCourses([...lmsClient.getCourses()]);
    setAssignments([...lmsClient.getAssignments()]);
  };

  return {
    persona,
    courses,
    assignments,
    selectedCourseId,
    selectedAssignmentId,
    activeTab,
    setActiveTab,
    switchPersona,
    selectCourse,
    selectAssignment,
    refreshData
  };
}

