CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL, 
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);


INSERT INTO organization (
	name, 
	description,
	contact_email,
	logo_filename

)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),

(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

CREATE TABLE service_project(
	project_id SERIAL PRIMARY KEY,
	organization_id INTEGER NOT NULL
		REFERENCES organization(organization_id),
	title VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	location VARCHAR(255) NOT NULL,
	date DATE NOT NULL
);

INSERT INTO service_project (
    organization_id,
    title,
    description,
    location,
    date
)
VALUES
    -- BrightFuture Builders (Organization ID: 1)
    (
        1,
        'Community Housing Renovation',
        'Renovating homes for low-income families.',
        'San Salvador',
        '2026-12-05'
    ),
    (
        1,
        'School Classroom Restoration',
        'Repairing and painting classrooms in public schools.',
        'Soyapango',
        '2026-12-12'
    ),
    (
        1,
        'Playground Construction',
        'Building safe playgrounds for children.',
        'Ciudad Delgado',
        '2027-01-09'
    ),
    (
        1,
        'Community Center Repairs',
        'Improving facilities at a local community center.',
        'Mejicanos',
        '2027-01-16'
    ),
    (
        1,
        'Home Accessibility Improvements',
        'Installing ramps and accessibility features for elderly residents.',
        'Santa Tecla',
        '2027-01-23'
    ),

    -- GreenHarvest Growers (Organization ID: 2)
    (
        2,
        'River Cleanup Campaign',
        'Removing waste from local rivers.',
        'San Salvador',
        '2026-12-15'
    ),
    (
        2,
        'Urban Tree Planting',
        'Planting native trees in urban neighborhoods.',
        'Antiguo Cuscatlán',
        '2026-12-19'
    ),
    (
        2,
        'Community Vegetable Garden',
        'Creating a sustainable vegetable garden for local families.',
        'Ciudad Delgado',
        '2027-01-10'
    ),
    (
        2,
        'Environmental Education Workshop',
        'Teaching students about recycling and environmental conservation.',
        'Santa Tecla',
        '2027-01-17'
    ),
    (
        2,
        'Public Park Restoration',
        'Cleaning and restoring green areas in public parks.',
        'San Salvador',
        '2027-01-24'
    ),

    -- UnityServe Volunteers (Organization ID: 3)
    (
        3,
        'Food Donation Drive',
        'Collecting and distributing food packages to families in need.',
        'Soyapango',
        '2026-12-20'
    ),
    (
        3,
        'Elderly Care Visit',
        'Visiting senior citizens and providing companionship and assistance.',
        'Ciudad Delgado',
        '2027-01-08'
    ),
    (
        3,
        'School Supplies Distribution',
        'Providing notebooks and educational supplies to students.',
        'Ilopango',
        '2027-01-15'
    ),
    (
        3,
        'Community Health Awareness Day',
        'Organizing educational activities about health and wellness.',
        'San Salvador',
        '2027-01-22'
    ),
    (
        3,
        'Clothing Donation Campaign',
        'Collecting and distributing clothing to vulnerable communities.',
        'Apopa',
        '2027-01-29'
    );

    CREATE TABLE category (
	category_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES
    ('Environmental'),
    ('Community Service'),
    ('Education'),
    ('Health & Wellness');

CREATE TABLE project_category (
	project_id INTEGER NOT NULL
		REFERENCES service_project(project_id),

	category_id INTEGER NOT NULL
		REFERENCES category(category_id),

	PRIMARY KEY (project_id, category_id)
);

INSERT INTO project_category (project_id, category_id)
VALUES
    -- BrightFuture Builders
    (1, 2),  -- Community Housing Renovation: Community Service
    (2, 3),  -- School Classroom Restoration: Education
    (2, 2),  -- School Classroom Restoration: Community Service
    (3, 2),  -- Playground Construction: Community Service
    (4, 2),  -- Community Center Repairs: Community Service
    (5, 2),  -- Home Accessibility Improvements: Community Service

    -- GreenHarvest Growers
    (6, 1),  -- River Cleanup Campaign: Environmental
    (6, 2),  -- River Cleanup Campaign: Community Service
    (7, 1),  -- Urban Tree Planting: Environmental
    (8, 1),  -- Community Vegetable Garden: Environmental
    (8, 2),  -- Community Vegetable Garden: Community Service
    (9, 1),  -- Environmental Education Workshop: Environmental
    (9, 3),  -- Environmental Education Workshop: Education
    (10, 1), -- Public Park Restoration: Environmental
    (10, 2), -- Public Park Restoration: Community Service

    -- UnityServe Volunteers
    (11, 2), -- Food Donation Drive: Community Service
    (12, 2), -- Elderly Care Visit: Community Service
    (12, 4), -- Elderly Care Visit: Health & Wellness
    (13, 2), -- School Supplies Distribution: Community Service
    (13, 3), -- School Supplies Distribution: Education
    (14, 2), -- Community Health Awareness Day: Community Service
    (14, 4), -- Community Health Awareness Day: Health & Wellness
    (15, 2); -- Clothing Donation Campaign: Community Service