export interface Roadmap {
  id: number;
  name: string;
  user_id: number;
}

export interface RoadmapItem {
  position: number;
  module_id: number;
  module_title: string;
  description: string;
  module_type: string;
  file_url: string;
  course_name: string;
  course_id: number;
  enrollment_status: 'enrolled' | 'not_enrolled';
  module_status: 'not_started' | 'in_progress' | 'completed';
}

export interface Module {
  id: number;
  module_title: string;
  description: string;
  module_type: string;
  file_url: string;
  course_name: string;
  course_id: number;
  tags: string[];
  matching_tags?: number;
}