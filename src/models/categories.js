import db from "./db.js";

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category;
    `;
    const result = await db.query(query);
    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows[0] ?? null;
}

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc
        ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
}

const assignCategoryToProject = async (projectId, categoryId) => {
    // Assign a category to a project
    const query = `
        INSERT INTO public.project_category(project_id, category_id)
        VALUES ($1, $2); 
    `; 
    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Assign new category assignments for the project
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category(name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [name]);
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2;

    `;
   const result = await db.query(query, [name, categoryId]);
   
   // If no rows were affected, the category does not exist
   if (result.rowCount === 0) {
    throw new Error('Category not found');
   }

   console.log(`Category with ID ${categoryId} updated successfully`);
};

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory};