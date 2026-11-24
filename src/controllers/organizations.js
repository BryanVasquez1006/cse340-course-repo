import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from "../models/organizations.js";
import {getProjectsByOrganizationId} from "../models/projects.js";
import { body, validationResult } from "express-validator";


// Define validation and sanitization rules for new organization form
const organizationValidation = [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3, max: 150 })
      .withMessage('Name must be between 3 and 150 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Organization description is required')
      .isLength({  max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('contactEmail')
      .trim()
      .notEmpty()
      .withMessage('Contact email is required')
      .isEmail()
      .withMessage('Contact email must be a valid email address')
      .normalizeEmail()

];

const showOrganizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  res.render("organizations", { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  console.log("organization email:", organizationDetails?.contact_email);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = 'Organization Details';

  res.render('organization', {title, organizationDetails, projects});
}

const showNewOrganizationForm = (req, res) => {
  const title = "Add New Organization";
  res.render("new-organization", { title });
}

const processNewOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors and display them
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    //redirect back to the new organization form with error messages
    return res.redirect('/new-organization');
  }
  const { name, description, contactEmail} = req.body;
  const logoFileName = 'placeholder-logo.png'; // use the placeholder logo for all new organizations 
  const organizationId = await createOrganization(name, description, contactEmail, logoFileName);

  // Set a success flash message
  req.flash('success', 'Organization added successfully!');
  res.redirect(`/organizations/${organizationId}`);
}

const showEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const title = "Edit Organization";

  console.log("VIEW DIRECTORY:", req.app.get("views"));

  res.render("edit-organization", { title, organizationDetails });
}

const processEditOrganizationForm = async (req, res) => {
  const organizationId = req.params.id;
  const { name, description, contactEmail, logoFilename } = req.body;



  await updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename,
  );

  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors and display them
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });
  }

  // Redirect back to the organization details page with a success message
  req.flash("success", "Organization updated successfully!");
  return res.redirect('/edit-organization/' + req.params.id);

};






export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm
};

