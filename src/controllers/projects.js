import {getUpcomingProjects, getProjectDetails, createProject} from "../models/projects.js";
import {getCategoriesByProjectId} from "../models/categories.js";
import {getAllOrganizations} from "../models/organizations.js";
import {body, validationResult} from "express-validator";


const projectValidation = [
   body('title').notEmpty().withMessage('Title is required').isLength({min: 3, max: 200}).withMessage('Title must be between 3 and 200 characters'),
   body('description').notEmpty().withMessage('Description is required').isLength({ max: 1000}),
   body('location').notEmpty().withMessage('Location is required').isLength({ max: 200}),
   body('date').notEmpty().withMessage('Date is required')
   .isISO8601().withMessage('Date must be a valid date format'),
   body('organizationId').notEmpty().withMessage('Organization is required').isInt().withMessage('Organization ID must be an integer')
]

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

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations(); // Get all organizations to populate the organization dropdown in the form

  res.render("new-project", {title: "Create New Project", organizations});
}; 


const processNewProjectForm = async (req, res, next) => {
  const { organizationId, title, description, location, date } = req.body; // Extract form data from the request body

  // Validate the form data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Loop through the errors and add them to the flash messages
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new project form if there are validation errors
    return res.redirect("/new-project");
  }

  try {
    // Create the new project in the database
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );
    req.flash("success", "New project created successfully"); // Optionally set a flash message
    res.redirect(`/project/${newProjectId}`); // Redirect to the newly created project's details page
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "Failed to create new project"); // Optionally set a flash message for the error
    res.redirect("/new-project"); // Redirect back to the new project form
  }
};




export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation};