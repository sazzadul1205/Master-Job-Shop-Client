import CompanyCard from "./CompanyCard/CompanyCard ";

const CompanyProfiles = () => {
  // Company data array in JSON format
  const companyData = [
    // CC1
    {
      companyName: "ABC Tech Solutions",
      companyCode: "CC1",
      location: "New York, USA",
      industry: "Technology",
      website: "https://abctechsolutions.com",
      logo: "https://i.ibb.co/pdX3pM4/ABC-Tech-Solutions.jpg",
      description:
        "Leading provider of tech solutions with a focus on innovation.",
      companyDetails: {
        foundingYear: 2010,
        employees: 500,
        revenue: "50M USD",
        ceo: "John Doe",
        services: [
          "Software Development",
          "Cloud Computing",
          "AI & Machine Learning",
          "Cybersecurity",
          "Blockchain Solutions",
          "Mobile Application Development",
        ],
        clients: [
          "Fortune 500 Companies",
          "Startups",
          "Government Agencies",
          "E-commerce Platforms",
        ],
        keyProjects: [
          {
            projectName: "AI-Powered Analytics",
            description:
              "Developed an AI-based analytics tool for real-time business insights.",
            year: 2023,
          },
          {
            projectName: "Cloud Transformation",
            description:
              "Migrated legacy infrastructure to a cloud-based system for a multinational firm.",
            year: 2022,
          },
          {
            projectName: "Mobile Payment System",
            description:
              "Built a secure mobile payment solution for an e-commerce company.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Cloud Solutions Provider",
            year: 2022,
            organization: "Tech Innovators Awards",
          },
          {
            awardName: "Top AI & ML Innovator",
            year: 2021,
            organization: "Global Tech Forum",
          },
        ],
        officeLocations: [
          "New York, USA",
          "London, UK",
          "Berlin, Germany",
          "Tokyo, Japan",
        ],
        partnerships: [
          {
            partnerName: "Microsoft",
            since: 2015,
            description:
              "Collaborated on cloud computing solutions and AI initiatives.",
          },
          {
            partnerName: "Amazon Web Services",
            since: 2018,
            description:
              "Joint projects in cloud infrastructure and cybersecurity.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/abctechsolutions",
          Twitter: "https://twitter.com/abctechsol",
          Facebook: "https://facebook.com/abctechsolutions",
        },
      },
    },
    // CC2
    {
      companyName: "XYZ Innovations",
      companyCode: "CC2",
      location: "San Francisco, CA, USA",
      industry: "Product Development",
      website: "https://xyzinnovations.com",
      logo: "https://i.ibb.co/g69CGbR/XYZ-Innovations.jpg",
      description: "Pioneering the future of product design and technology.",
      companyDetails: {
        foundingYear: 2015,
        employees: 300,
        revenue: "30M USD",
        ceo: "Jane Smith",
        services: [
          "Product Design",
          "Prototyping",
          "Manufacturing Solutions",
          "R&D for New Technologies",
        ],
        clients: [
          "Tech Startups",
          "Healthcare Companies",
          "Automotive Industry",
        ],
        keyProjects: [
          {
            projectName: "Smart Home Devices",
            description:
              "Developed a series of IoT-enabled smart home devices.",
            year: 2022,
          },
          {
            projectName: "Sustainable Packaging",
            description:
              "Designed eco-friendly packaging solutions for consumer products.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Innovative Product Design Award",
            year: 2022,
            organization: "Global Design Awards",
          },
          {
            awardName: "Sustainability Pioneer",
            year: 2021,
            organization: "GreenTech Forum",
          },
        ],
        officeLocations: [
          "San Francisco, USA",
          "Toronto, Canada",
          "Sydney, Australia",
        ],
        partnerships: [
          {
            partnerName: "Tesla",
            since: 2020,
            description: "Collaborated on electric vehicle component design.",
          },
          {
            partnerName: "Google",
            since: 2019,
            description:
              "Worked on advanced product research for smart devices.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/xyzinnovations",
          Twitter: "https://twitter.com/xyzinnovations",
          Facebook: "https://facebook.com/xyzinnovations",
        },
      },
    },
    // CC3
    {
      companyName: "DataGen Corp",
      companyCode: "CC3",
      location: "Austin, TX, USA",
      industry: "Data Analytics",
      website: "https://datagencorp.com",
      logo: "https://i.ibb.co/vjnNhZ5/Data-Gen-Corp.jpg",
      description: "Empowering businesses through data-driven solutions.",
      companyDetails: {
        foundingYear: 2012,
        employees: 450,
        revenue: "70M USD",
        ceo: "Emily Johnson",
        services: [
          "Big Data Analytics",
          "Data Warehousing",
          "Business Intelligence",
          "Predictive Analytics",
          "Machine Learning",
          "Data Visualization",
        ],
        clients: [
          "Retail Companies",
          "Healthcare Providers",
          "Finance Institutions",
          "Government Agencies",
        ],
        keyProjects: [
          {
            projectName: "Predictive Analytics Platform",
            description:
              "Developed a machine learning-based predictive analytics platform for retail.",
            year: 2023,
          },
          {
            projectName: "Healthcare Data Dashboard",
            description:
              "Created an interactive dashboard for real-time healthcare data analysis.",
            year: 2021,
          },
          {
            projectName: "Financial Risk Modeling",
            description:
              "Designed a data-driven financial risk model for a multinational bank.",
            year: 2022,
          },
        ],
        awards: [
          {
            awardName: "Top Data Analytics Provider",
            year: 2021,
            organization: "Data Science Awards",
          },
          {
            awardName: "Excellence in Predictive Analytics",
            year: 2022,
            organization: "Global Analytics Summit",
          },
        ],
        officeLocations: [
          "Austin, USA",
          "Chicago, USA",
          "Berlin, Germany",
          "Singapore",
        ],
        partnerships: [
          {
            partnerName: "IBM",
            since: 2016,
            description: "Collaborated on AI-driven data analytics solutions.",
          },
          {
            partnerName: "Oracle",
            since: 2017,
            description:
              "Partnership in developing cloud-based data warehousing systems.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/datagencorp",
          Twitter: "https://twitter.com/datagencorp",
          Facebook: "https://facebook.com/datagencorp",
        },
      },
    },
    // CC4
    {
      companyName: "Creative Solutions",
      companyCode: "CC4",
      location: "Chicago, IL, USA",
      industry: "Marketing",
      website: "https://creativesolutions.com",
      logo: "https://i.ibb.co/Zd06wTm/Creative-Solutions.jpg",
      description: "Your partner in creative marketing strategies.",
      companyDetails: {
        foundingYear: 2008,
        employees: 300,
        revenue: "40M USD",
        ceo: "Michael Carter",
        services: [
          "Digital Marketing",
          "Brand Strategy",
          "Social Media Marketing",
          "SEO & Content Creation",
          "Advertising Campaigns",
          "Creative Design",
        ],
        clients: [
          "Retail Brands",
          "Tech Startups",
          "E-commerce Companies",
          "Nonprofit Organizations",
        ],
        keyProjects: [
          {
            projectName: "Global Brand Campaign",
            description:
              "Managed a global rebranding campaign for a Fortune 500 company.",
            year: 2022,
          },
          {
            projectName: "Social Media Growth Strategy",
            description:
              "Developed a social media strategy that increased client engagement by 200%.",
            year: 2023,
          },
          {
            projectName: "E-commerce Digital Marketing",
            description:
              "Executed an SEO and PPC strategy that boosted sales by 150%.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Creative Agency",
            year: 2021,
            organization: "Marketing Excellence Awards",
          },
          {
            awardName: "Top Brand Strategy Firm",
            year: 2022,
            organization: "Global Marketing Summit",
          },
        ],
        officeLocations: [
          "Chicago, USA",
          "Toronto, Canada",
          "London, UK",
          "Sydney, Australia",
        ],
        partnerships: [
          {
            partnerName: "Facebook",
            since: 2017,
            description:
              "Worked together on social media advertising strategies.",
          },
          {
            partnerName: "Google",
            since: 2018,
            description:
              "Collaborated on SEO and digital marketing tools development.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/creativesolutions",
          Twitter: "https://twitter.com/creativesolutions",
          Facebook: "https://facebook.com/creativesolutions",
        },
      },
    },
    // CC5
    {
      companyName: "DesignWorks",
      companyCode: "CC5",
      location: "Los Angeles, CA, USA",
      industry: "Design",
      website: "https://designworks.com",
      logo: "https://i.ibb.co/k23sCpr/Design-Works.png",
      description: "Designing impactful experiences for brands and businesses.",
      companyDetails: {
        foundingYear: 2010,
        employees: 150,
        revenue: "25M USD",
        ceo: "Lisa Roberts",
        services: [
          "Graphic Design",
          "User Experience (UX) Design",
          "Brand Identity",
          "Packaging Design",
          "Web Design",
          "Illustration",
        ],
        clients: [
          "Fashion Brands",
          "Entertainment Companies",
          "Technology Firms",
          "Nonprofits",
        ],
        keyProjects: [
          {
            projectName: "Brand Identity for Fashion Brand",
            description:
              "Designed a new brand identity for a global fashion brand.",
            year: 2023,
          },
          {
            projectName: "UX/UI for Entertainment Platform",
            description:
              "Created a user-friendly interface for a streaming service.",
            year: 2022,
          },
          {
            projectName: "Packaging Design for Consumer Product",
            description:
              "Developed sustainable packaging for an eco-friendly product line.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best UX Design",
            year: 2021,
            organization: "Design Innovators Awards",
          },
          {
            awardName: "Top Branding Agency",
            year: 2022,
            organization: "Global Design Forum",
          },
        ],
        officeLocations: [
          "Los Angeles, USA",
          "Paris, France",
          "Tokyo, Japan",
          "Berlin, Germany",
        ],
        partnerships: [
          {
            partnerName: "Adobe",
            since: 2015,
            description: "Collaborated on design software and tools.",
          },
          {
            partnerName: "Apple",
            since: 2018,
            description:
              "Worked together on UX/UI design for mobile applications.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/designworks",
          Twitter: "https://twitter.com/designworks",
          Facebook: "https://facebook.com/designworks",
        },
      },
    },
    // CC6
    {
      companyName: "CloudNet Systems",
      companyCode: "CC6",
      location: "Boston, MA, USA",
      industry: "Cloud Computing",
      website: "https://cloudnetsystems.com",
      logo: "https://i.ibb.co/tM67xj7/Cloud-Net-Systems.jpg",
      description: "Cloud solutions tailored to your business needs.",
      companyDetails: {
        foundingYear: 2015,
        employees: 200,
        revenue: "50M USD",
        ceo: "Sara Johnson",
        services: [
          "Cloud Infrastructure",
          "Managed Services",
          "Cloud Storage Solutions",
          "Disaster Recovery",
          "Consulting Services",
        ],
        clients: [
          "Healthcare Organizations",
          "Financial Institutions",
          "Retail Chains",
          "Government Agencies",
        ],
        keyProjects: [
          {
            projectName: "Cloud Migration for a Fortune 500 Company",
            description:
              "Led a cloud migration project that reduced costs by 30%.",
            year: 2022,
          },
          {
            projectName: "Disaster Recovery Implementation",
            description:
              "Implemented a disaster recovery solution for a healthcare provider.",
            year: 2023,
          },
          {
            projectName: "Cloud Storage Optimization",
            description:
              "Optimized storage solutions for an e-commerce platform.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Cloud Computing Company",
            year: 2022,
            organization: "Tech Innovators Awards",
          },
          {
            awardName: "Top Managed Services Provider",
            year: 2023,
            organization: "Global Cloud Summit",
          },
        ],
        officeLocations: [
          "Boston, USA",
          "New York, USA",
          "Toronto, Canada",
          "London, UK",
        ],
        partnerships: [
          {
            partnerName: "Amazon Web Services",
            since: 2017,
            description: "Partnered for cloud service optimization.",
          },
          {
            partnerName: "Microsoft Azure",
            since: 2018,
            description:
              "Worked together on cloud solutions for enterprise clients.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/cloudnetsystems",
          Twitter: "https://twitter.com/cloudnetsystems",
          Facebook: "https://facebook.com/cloudnetsystems",
        },
      },
    },
    // CC7
    {
      companyName: "Creative Agency",
      companyCode: "CC7",
      location: "Miami, FL, USA",
      industry: "Creative Services",
      website: "https://creativeagency.com",
      logo: "https://i.ibb.co/1qf6WgF/Creative-Agency.png",
      description: "Innovative solutions for creative marketing.",
      companyDetails: {
        foundingYear: 2018,
        employees: 100,
        revenue: "20M USD",
        ceo: "David Lee",
        services: [
          "Brand Strategy",
          "Graphic Design",
          "Content Creation",
          "Video Production",
          "Web Development",
        ],
        clients: [
          "Fashion Brands",
          "Tech Startups",
          "Health and Wellness",
          "Nonprofits",
        ],
        keyProjects: [
          {
            projectName: "Brand Launch for New Fashion Line",
            description: "Executed a successful brand launch campaign.",
            year: 2023,
          },
          {
            projectName: "Website Redesign for a Nonprofit",
            description:
              "Revamped a nonprofit’s website for better user engagement.",
            year: 2022,
          },
          {
            projectName: "Social Media Campaign for Health Product",
            description:
              "Created a viral social media campaign for a health product.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Creative Agency",
            year: 2022,
            organization: "Creative Excellence Awards",
          },
          {
            awardName: "Top Video Production Company",
            year: 2023,
            organization: "Marketing Industry Awards",
          },
        ],
        officeLocations: ["Miami, USA", "Los Angeles, USA", "New York, USA"],
        partnerships: [
          {
            partnerName: "Adobe",
            since: 2019,
            description: "Collaborated on creative software development.",
          },
          {
            partnerName: "Canva",
            since: 2020,
            description: "Utilized Canva for design projects.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/creativeagency",
          Twitter: "https://twitter.com/creativeagency",
          Facebook: "https://facebook.com/creativeagency",
        },
      },
    },
    // CC8
    {
      companyName: "ABC Construction",
      companyCode: "CC8",
      location: "Seattle, WA, USA",
      industry: "Construction",
      website: "https://abcconstruction.com",
      logo: "https://i.ibb.co/jrkC9Rc/ABC-Construction.png",
      description: "Building the future with quality construction.",
      companyDetails: {
        foundingYear: 2005,
        employees: 300,
        revenue: "80M USD",
        ceo: "Michael Brown",
        services: [
          "Residential Construction",
          "Commercial Construction",
          "Renovation and Remodeling",
          "Project Management",
          "Design-Build Services",
        ],
        clients: [
          "Real Estate Developers",
          "Government Contracts",
          "Retail Chains",
          "Private Homeowners",
        ],
        keyProjects: [
          {
            projectName: "Luxury Apartment Complex in Downtown Seattle",
            description: "Developed a 200-unit luxury apartment complex.",
            year: 2022,
          },
          {
            projectName: "Green Building Initiative",
            description:
              "Constructed the first LEED-certified building in the area.",
            year: 2021,
          },
          {
            projectName: "Renovation of Historic Landmark",
            description: "Successfully renovated a historic landmark building.",
            year: 2020,
          },
        ],
        awards: [
          {
            awardName: "Best Construction Company",
            year: 2023,
            organization: "Seattle Construction Awards",
          },
          {
            awardName: "Green Building Award",
            year: 2022,
            organization: "Eco-Build Awards",
          },
        ],
        officeLocations: ["Seattle, USA", "Portland, OR, USA"],
        partnerships: [
          {
            partnerName: "National Association of Home Builders",
            since: 2010,
            description:
              "Member of the NAHB for best practices in home building.",
          },
          {
            partnerName: "American Institute of Architects",
            since: 2012,
            description:
              "Collaboration for architectural design and innovation.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/abcconstruction",
          Twitter: "https://twitter.com/abcconstruction",
          Facebook: "https://facebook.com/abcconstruction",
        },
      },
    },
    // CC9
    {
      companyName: "XYZ Corp",
      companyCode: "CC9",
      location: "Houston, TX, USA",
      industry: "Various",
      website: "https://xyzcorp.com",
      logo: "https://i.ibb.co/RpJc7zv/XYZ-Corp.png",
      description: "Diverse solutions for a changing world.",
      companyDetails: {
        foundingYear: 1998,
        employees: 1500,
        revenue: "500M USD",
        ceo: "Laura Smith",
        services: [
          "Consulting",
          "Manufacturing",
          "Technology Solutions",
          "Logistics",
          "Financial Services",
        ],
        clients: [
          "Multinational Corporations",
          "Startups",
          "Government Agencies",
          "Nonprofits",
        ],
        keyProjects: [
          {
            projectName: "Global Expansion Initiative",
            description:
              "Provided consulting for clients entering new markets.",
            year: 2022,
          },
          {
            projectName: "Innovative Tech Solutions for Enterprises",
            description: "Developed a tech platform for several large clients.",
            year: 2021,
          },
          {
            projectName: "Sustainability in Manufacturing",
            description:
              "Implemented sustainable practices in manufacturing processes.",
            year: 2020,
          },
        ],
        awards: [
          {
            awardName: "Top 100 Companies to Work For",
            year: 2023,
            organization: "Fortune Magazine",
          },
          {
            awardName: "Best Innovation in Business",
            year: 2022,
            organization: "Innovation Awards",
          },
        ],
        officeLocations: ["Houston, USA", "Dallas, USA", "Miami, FL, USA"],
        partnerships: [
          {
            partnerName: "IBM",
            since: 2019,
            description: "Partnered for technology and innovation solutions.",
          },
          {
            partnerName: "Deloitte",
            since: 2018,
            description: "Collaboration for consulting and advisory services.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/xyzcorp",
          Twitter: "https://twitter.com/xyzcorp",
          Facebook: "https://facebook.com/xyzcorp",
        },
      },
    },
    // CC10
    {
      companyName: "ABC Products",
      companyCode: "CC10",
      location: "Phoenix, AZ, USA",
      industry: "Consumer Goods",
      website: "https://abcproducts.com",
      logo: "https://i.ibb.co/sFk00kV/ABC-Products.png",
      description: "Quality products for everyday life.",
      companyDetails: {
        foundingYear: 2010,
        employees: 250,
        revenue: "50M USD",
        ceo: "David Green",
        products: [
          "Household Items",
          "Personal Care Products",
          "Electronics",
          "Kitchenware",
          "Health Supplements",
        ],
        clients: [
          "Retailers",
          "Wholesalers",
          "E-commerce Platforms",
          "Individual Consumers",
        ],
        keyProducts: [
          {
            productName: "Eco-Friendly Cleaning Supplies",
            description: "Biodegradable and effective cleaning products.",
            yearLaunched: 2022,
          },
          {
            productName: "Smart Kitchen Appliances",
            description: "Innovative kitchen gadgets for modern cooking.",
            yearLaunched: 2021,
          },
          {
            productName: "Nutritional Supplements",
            description: "Vitamins and minerals for everyday health.",
            yearLaunched: 2020,
          },
        ],
        awards: [
          {
            awardName: "Best Consumer Goods Company",
            year: 2023,
            organization: "Consumer Product Awards",
          },
          {
            awardName: "Sustainability Award",
            year: 2022,
            organization: "Green Business Network",
          },
        ],
        officeLocations: ["Phoenix, AZ, USA", "Las Vegas, NV, USA"],
        partnerships: [
          {
            partnerName: "Sustainable Goods Association",
            since: 2015,
            description: "Member promoting sustainable consumer products.",
          },
          {
            partnerName: "Local Farmers Network",
            since: 2018,
            description: "Collaboration for sourcing local ingredients.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/abcproducts",
          Twitter: "https://twitter.com/abcproducts",
          Facebook: "https://facebook.com/abcproducts",
        },
      },
    },
    // CC11
    {
      companyName: "Retail Co.",
      companyCode: "CC11",
      location: "Philadelphia, PA, USA",
      industry: "Retail",
      website: "https://retailco.com",
      logo: "https://i.ibb.co/K71CqTz/Retail-Co.png",
      description: "Your go-to destination for retail solutions.",
      companyDetails: {
        foundingYear: 2008,
        employees: 600,
        revenue: "200M USD",
        ceo: "Jennifer Taylor",
        services: [
          "Retail Consulting",
          "Supply Chain Management",
          "E-commerce Solutions",
          "Brand Development",
          "Market Research",
        ],
        clients: [
          "Retail Chains",
          "Small Businesses",
          "Startups",
          "E-commerce Platforms",
        ],
        keyProjects: [
          {
            projectName: "E-commerce Platform Development",
            description: "Built an e-commerce solution for a major retailer.",
            year: 2023,
          },
          {
            projectName: "Brand Revitalization Project",
            description: "Revamped branding for a well-known retail chain.",
            year: 2022,
          },
          {
            projectName: "Supply Chain Optimization",
            description: "Improved supply chain processes for efficiency.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Top Retail Consulting Firm",
            year: 2023,
            organization: "Retail Business Awards",
          },
          {
            awardName: "Innovation in Retail",
            year: 2022,
            organization: "Retail Innovation Awards",
          },
        ],
        officeLocations: [
          "Philadelphia, PA, USA",
          "New York, NY, USA",
          "Chicago, IL, USA",
        ],
        partnerships: [
          {
            partnerName: "National Retail Federation",
            since: 2016,
            description:
              "Member of the NRF advocating for the retail industry.",
          },
          {
            partnerName: "Retail Analytics Group",
            since: 2019,
            description: "Collaboration for data-driven retail strategies.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/retailco",
          Twitter: "https://twitter.com/retailco",
          Facebook: "https://facebook.com/retailco",
        },
      },
    },
    // CC12
    {
      companyName: "Business Solutions Inc.",
      companyCode: "CC12",
      location: "Dallas, TX, USA",
      industry: "Business Services",
      website: "https://businesssolutionsinc.com",
      logo: "https://i.ibb.co/N6tHYg6/Business-Solutions-Inc.png",
      description: "Comprehensive solutions for business success.",
      companyDetails: {
        foundingYear: 2015,
        employees: 400,
        revenue: "120M USD",
        ceo: "Mark Johnson",
        services: [
          "Consulting",
          "Project Management",
          "Outsourcing",
          "Technology Solutions",
          "Training and Development",
        ],
        clients: [
          "Corporations",
          "Startups",
          "Non-Profit Organizations",
          "Government Agencies",
        ],
        keyProjects: [
          {
            projectName: "ERP Implementation for a Fortune 500 Company",
            description:
              "Streamlined operations through an integrated ERP system.",
            year: 2022,
          },
          {
            projectName: "Outsourcing Strategy Development",
            description: "Designed outsourcing solutions for cost efficiency.",
            year: 2023,
          },
          {
            projectName: "Leadership Training Program",
            description: "Developed a program to enhance leadership skills.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Business Service Provider",
            year: 2023,
            organization: "Business Excellence Awards",
          },
          {
            awardName: "Innovation in Consulting",
            year: 2022,
            organization: "Consulting Innovators",
          },
        ],
        officeLocations: ["Dallas, TX, USA", "Houston, TX, USA"],
        partnerships: [
          {
            partnerName: "Project Management Institute",
            since: 2017,
            description: "Member supporting project management best practices.",
          },
          {
            partnerName: "Technology Service Provider Alliance",
            since: 2020,
            description: "Collaboration for advanced technology solutions.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/businesssolutionsinc",
          Twitter: "https://twitter.com/businesssolutionsinc",
          Facebook: "https://facebook.com/businesssolutionsinc",
        },
      },
    },
    // CC13
    {
      companyName: "Finance Group",
      companyCode: "CC13",
      location: "Atlanta, GA, USA",
      industry: "Finance",
      website: "https://financegroup.com",
      logo: "https://i.ibb.co/yf116XL/Finance-Group.png",
      description: "Expertise in financial solutions.",
      companyDetails: {
        foundingYear: 2010,
        employees: 300,
        revenue: "80M USD",
        ceo: "Samantha White",
        services: [
          "Investment Management",
          "Financial Consulting",
          "Tax Services",
          "Risk Management",
          "Retirement Planning",
        ],
        clients: [
          "Individuals",
          "Small Businesses",
          "Corporations",
          "Non-Profits",
        ],
        keyProjects: [
          {
            projectName: "Wealth Management for High-Net-Worth Individuals",
            description: "Personalized financial strategies for wealth growth.",
            year: 2023,
          },
          {
            projectName: "Tax Optimization Strategies",
            description: "Developed tax-efficient investment strategies.",
            year: 2022,
          },
          {
            projectName: "Corporate Risk Assessment",
            description: "Conducted risk assessments for large corporations.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Top Financial Consulting Firm",
            year: 2023,
            organization: "Financial Advisors Association",
          },
          {
            awardName: "Excellence in Financial Services",
            year: 2022,
            organization: "Finance Industry Awards",
          },
        ],
        officeLocations: ["Atlanta, GA, USA", "Charleston, SC, USA"],
        partnerships: [
          {
            partnerName: "American Finance Association",
            since: 2016,
            description:
              "Active member promoting finance education and research.",
          },
          {
            partnerName: "Financial Planning Association",
            since: 2019,
            description: "Collaboration for financial planning standards.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/financegroup",
          Twitter: "https://twitter.com/financegroup",
          Facebook: "https://facebook.com/financegroup",
        },
      },
    },
    // CC14
    {
      companyName: "Events Company",
      companyCode: "CC14",
      location: "Orlando, FL, USA",
      industry: "Events Management",
      website: "https://eventscompany.com",
      logo: "https://i.ibb.co/gr4yZ9W/Events-Company.png",
      description: "Creating unforgettable events.",
      companyDetails: {
        foundingYear: 2015,
        employees: 150,
        revenue: "20M USD",
        ceo: "Jessica Taylor",
        services: [
          "Event Planning",
          "Venue Management",
          "Catering Services",
          "Entertainment Coordination",
          "Event Marketing",
        ],
        clients: ["Corporations", "Non-Profits", "Individuals"],
        keyProjects: [
          {
            projectName: "Annual Charity Gala",
            description:
              "Organized a successful charity event raising over $500,000.",
            year: 2023,
          },
          {
            projectName: "Corporate Retreat",
            description: "Managed a weekend retreat for a major corporation.",
            year: 2022,
          },
          {
            projectName: "Wedding Planning",
            description: "Coordinated multiple high-profile weddings.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Event Management Company",
            year: 2023,
            organization: "Event Planning Association",
          },
          {
            awardName: "Excellence in Service",
            year: 2022,
            organization: "National Event Awards",
          },
        ],
        officeLocations: ["Orlando, FL, USA", "Tampa, FL, USA"],
        partnerships: [
          {
            partnerName: "Local Venues Association",
            since: 2018,
            description: "Collaborating for the best venue options.",
          },
          {
            partnerName: "Catering Excellence Group",
            since: 2019,
            description: "Providing quality catering services.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/eventscompany",
          Twitter: "https://twitter.com/eventscompany",
          Facebook: "https://facebook.com/eventscompany",
        },
      },
    },
    // CC15
    {
      companyName: "Design Studio",
      companyCode: "CC15",
      location: "Denver, CO, USA",
      industry: "Design",
      website: "https://designstudio.com",
      logo: "https://i.ibb.co/nkKg5zn/Design-Studio.png",
      description: "Crafting unique designs for brands.",
      companyDetails: {
        foundingYear: 2018,
        employees: 50,
        revenue: "5M USD",
        ceo: "Michael Brown",
        services: [
          "Brand Identity Design",
          "Web Design",
          "Graphic Design",
          "Product Packaging",
          "UX/UI Design",
        ],
        clients: ["Startups", "Corporations", "Non-Profits"],
        keyProjects: [
          {
            projectName: "Rebranding for a Tech Company",
            description: "Developed a new brand identity and website.",
            year: 2023,
          },
          {
            projectName: "Packaging Design for Eco-Friendly Products",
            description: "Created sustainable packaging solutions.",
            year: 2022,
          },
          {
            projectName: "User Experience Redesign",
            description: "Improved the UX of a popular app.",
            year: 2021,
          },
        ],
        awards: [
          {
            awardName: "Best Design Studio",
            year: 2023,
            organization: "Design Excellence Awards",
          },
          {
            awardName: "Outstanding Graphic Design",
            year: 2022,
            organization: "Graphic Design Association",
          },
        ],
        officeLocations: ["Denver, CO, USA", "Boulder, CO, USA"],
        partnerships: [
          {
            partnerName: "Design Collaborators",
            since: 2020,
            description: "Working together on innovative projects.",
          },
          {
            partnerName: "Sustainable Design Network",
            since: 2021,
            description: "Promoting sustainable design practices.",
          },
        ],
        socialMedia: {
          LinkedIn: "https://linkedin.com/company/designstudio",
          Twitter: "https://twitter.com/designstudio",
          Facebook: "https://facebook.com/designstudio",
        },
      },
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Company Profiles
          </p>
          <p className="text-xl">
            Discover companies and their career opportunities.
          </p>
        </div>

        {/* Company Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {companyData.map((company, index) => (
            <CompanyCard
              key={index}
              companyName={company.companyName}
              location={company.location}
              industry={company.industry}
              website={company.website}
              logo={company.logo}
              description={company.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfiles;
