import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThreeDCardDemo } from '../components/common/Card3d';
import ImageDialog from '../components/common/ImageDialog';
import { PaginationComponent } from '../components/pagination';

interface Project {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  demoLink: string;
  codeLink: string;
  techStack: string[];
}

const Works: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/data/works.json');
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects data');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const openImageDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsDialogOpen(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination values
  const indexOfLastProject = currentPage * cardsPerPage;
  const indexOfFirstProject = indexOfLastProject - cardsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / cardsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Highlighted Projects</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center max-w-3xl mx-auto">
        Explore my recent work and highlighted projects. Each project represents a unique challenge and solution.
        <span className="block mt-2 text-sm italic">Click on any card to view more project images</span>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {currentProjects.map((project) => (
          <div key={project.id} className="flex justify-center">
            <ThreeDCardDemo
              title={project.title}
              description={project.description}
              image={project.image}
              images={project.images || [project.image]}
              demoLink={project.demoLink}
              codeLink={project.codeLink}
              techStack={project.techStack}
              tag={project.tag}
              onClick={() => openImageDialog(project)}
            />
          </div>
        ))}
      </div>
      
      {/* Add pagination component */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-start z-10">
          <PaginationComponent 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
      
      {selectedProject && (
        <ImageDialog 
          isOpen={isDialogOpen} 
          onClose={closeImageDialog} 
          images={selectedProject.images || [selectedProject.image]}
          title={selectedProject.title}
        />
      )}
    </div>
  );
};

export default Works;
