import db from "./db.js";

const getAllProjects = async () => {
    const query = `
        SELECT sp.project_id,
        sp.title,
        sp.description,
        sp.location,
        sp.date,
        o.name AS organization_name
        FROM service_project AS sp
        INNER JOIN organization AS o
        ON sp.organization_id = o.organization_id;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
        project_id,
        organization_id,
        title,
        description,
        location,
        date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    // Return the rows of the result set, or an empty array if no rows are found
    return result.rows;
}

const getProjectDetails = async (projectId) => {
    const query = `
        SELECT 
        sp.project_id,
        sp.title,
        sp.description,
        sp.date,
        sp.location,
        o.organization_id,
        o.name AS organization_name
        FROM service_project AS sp
        INNER JOIN organization AS o
        ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows[0] ?? null; // Return the first row or null if no rows are found
}

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT 
      sp.project_id,
      sp.title,
      sp.description,
      sp.date,
      sp.location,
      o.organization_id,
      o.name AS organization_name
    FROM service_project AS sp
    INNER JOIN organization AS o
    ON sp.organization_id = o.organization_id
    WHERE sp.date >= CURRENT_DATE
    ORDER BY sp.date ASC
    LIMIT $1;
  `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);
  return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId, getProjectDetails, getUpcomingProjects };
