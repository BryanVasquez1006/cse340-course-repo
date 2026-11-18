import {getUpcomingProjects, getProjectDetails} from "../models/projects.js";
import {getCategoriesByProjectId} from "../models/categories.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5; // Define the number of upcoming projects to retrieve
const showProjectsPage = async (req, res) => {
  const upcomingProjects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS); // Get the 5 upcoming projects
  const title = "Upcoming Service Projects"; // Set the title for the page
  res.render("projects", { title, upcomingProjects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id // Get the project ID from the request parameters
    const projectDetails = await getProjectDetails(projectId); // Get the project details from the model

    if (!projectDetails) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const categories = await getCategoriesByProjectId(projectId); // Get the categories associated with the project
    
    res.render("project", { 
      title: projectDetails.title,
      projectDetails,
      categories
     }); // Render the project details page with the retrieved data
}



export { showProjectsPage, showProjectDetailsPage };