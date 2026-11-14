import express from 'express';
import { showMainPage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import { showProjectsPage } from "./controllers/projects.js";
import { showCategoriesPage } from "./controllers/categories.js";
import { handle500Error } from "./controllers/errors.js";

const router = express.Router();

/**
  * Routes
  */
router.get('/', showMainPage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

//Error-handling routes
router.get('/test-error', handle500Error);

export default router;