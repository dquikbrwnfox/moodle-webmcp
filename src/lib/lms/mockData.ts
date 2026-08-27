import { Course, Persona, Assignment, StudentSubmission } from '../../types/lms';

export const PERSONAS: Persona[] = [
  {
    id: 'student-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@apex.edu',
    role: 'student',
    title: 'Undergraduate Senior (Computer Science & Biology)',
    institution: 'Apex University',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'instructor-evelyn',
    name: 'Dr. Evelyn Vance',
    email: 'e.vance@apex.edu',
    role: 'instructor',
    title: 'Associate Professor & CS101 / BIO200 Course Director',
    institution: 'Apex University',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 101,
    code: 'CS 101',
    name: 'Introduction to Artificial Intelligence',
    term: 'Fall 2026',
    instructor: 'Dr. Evelyn Vance',
    instructorEmail: 'e.vance@apex.edu',
    department: 'Computer Science',
    progressPercent: 68,
    color: 'from-blue-600 to-indigo-700',
    announcements: [
      {
        id: 1,
        courseId: 101,
        courseCode: 'CS 101',
        title: 'Assignment 2 Ethics Rubric Clarification',
        author: 'Dr. Evelyn Vance',
        authorRole: 'Professor',
        publishedAt: '2026-08-24T14:00:00Z',
        content: 'Please ensure your ethical reasoning analysis explicitly cites at least two philosophical frameworks (e.g. Utilitarianism, Deontology, or Virtue Ethics). The rubric has been updated to reflect this 30-point weight.',
        isPinned: true
      },
      {
        id: 2,
        courseId: 101,
        courseCode: 'CS 101',
        title: 'Midterm Review Session & Office Hours',
        author: 'Marcus Chen (TA)',
        authorRole: 'Teaching Assistant',
        publishedAt: '2026-08-20T09:30:00Z',
        content: 'Review session will take place via Zoom this Thursday at 5 PM PT. Recording will be posted here.',
        isPinned: false
      }
    ],
    forums: [
      {
        id: 301,
        courseId: 101,
        title: 'Week 4 Discussion: Agent Autonomy in Safety-Critical Systems',
        starter: 'Dr. Evelyn Vance',
        replyCount: 14,
        lastActivity: '2026-08-26T18:20:00Z',
        posts: [
          {
            id: 1,
            discussionId: 301,
            author: 'Dr. Evelyn Vance',
            authorRole: 'instructor',
            createdAt: '2026-08-22T10:00:00Z',
            subject: 'Prompt: Where should the human-in-the-loop cutoff sit?',
            message: 'In your view, should browser-agent systems require explicit human confirmation for financial or submission actions, or can confidence scoring automate them safely?'
          },
          {
            id: 2,
            discussionId: 301,
            author: 'Jordan Bell',
            authorRole: 'student',
            createdAt: '2026-08-23T15:10:00Z',
            subject: 'Re: Prompt: Where should the human-in-the-loop cutoff sit?',
            message: 'I think financial actions should always have an unambiguous human confirmation modal, but read queries can be autonomous.'
          }
        ]
      }
    ],
    sections: [
      {
        id: 1,
        title: 'Module 1: Foundations of Machine Learning & Reasoning',
        summary: 'Historical foundations, search algorithms, heuristic methods, and representation.',
        items: [
          { id: 101, title: 'Lecture 1: State Space Search & A* Algorithm', type: 'reading', isCompleted: true },
          { id: 102, title: 'Lab 1: Implementing Heuristic Pathfinding', type: 'assignment', assignmentId: 1001, isCompleted: true }
        ]
      },
      {
        id: 2,
        title: 'Module 2: LLMs, Agents & The Open Web Protocol',
        summary: 'Transformers, tool-calling APIs, WebMCP specifications, and ethical evaluation.',
        items: [
          { id: 103, title: 'Lecture 4: Emerging Web Standards & Model Context Protocol', type: 'reading', isCompleted: true },
          { id: 104, title: 'Assignment 2: Ethics of Autonomous Agent Systems', type: 'assignment', assignmentId: 1002, isCompleted: false },
          { id: 105, title: 'Week 4 Discussion: Agent Autonomy', type: 'forum', isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 202,
    code: 'BIO 200',
    name: 'Molecular & Cellular Genetics',
    term: 'Fall 2026',
    instructor: 'Dr. Sanjay Patel',
    instructorEmail: 's.patel@apex.edu',
    department: 'Biological Sciences',
    progressPercent: 50,
    color: 'from-emerald-600 to-teal-700',
    announcements: [
      {
        id: 3,
        courseId: 202,
        courseCode: 'BIO 200',
        title: 'Lab Report 2 CRISPR Protocol Template Uploaded',
        author: 'Dr. Sanjay Patel',
        authorRole: 'Professor',
        publishedAt: '2026-08-25T11:00:00Z',
        content: 'Check the lab module for the latest protocol template. Make sure your gel electrophoresis analysis adheres to standard error propagation rules.',
        isPinned: true
      }
    ],
    forums: [
      {
        id: 302,
        courseId: 202,
        title: 'Lab 2 Q&A: Gel Electrophoresis Banding Interpretation',
        starter: 'Sophia Martinez',
        replyCount: 8,
        lastActivity: '2026-08-26T21:00:00Z',
        posts: [
          {
            id: 1,
            discussionId: 302,
            author: 'Sophia Martinez',
            authorRole: 'student',
            createdAt: '2026-08-25T14:00:00Z',
            subject: 'Question on Lane 4 smear',
            message: 'Did anyone else notice a slight smear in Lane 4 for the Cas9 digest?'
          }
        ]
      }
    ],
    sections: [
      {
        id: 3,
        title: 'Unit 1: Genomic Structures & Transcription Regulation',
        summary: 'Chromatin organization, promoter kinetics, and transcriptional factors.',
        items: [
          { id: 201, title: 'Reading: Eukaryotic Transcription Factors', type: 'reading', isCompleted: true },
          { id: 202, title: 'Lab 1: Polymerase Chain Reaction Assay', type: 'assignment', assignmentId: 2001, isCompleted: true }
        ]
      },
      {
        id: 4,
        title: 'Unit 2: CRISPR-Cas9 & Targeted Gene Editing',
        summary: 'Guide RNA design, off-target detection, and homologous repair mechanics.',
        items: [
          { id: 203, title: 'Lab 2: CRISPR Target Site Selectivity Analysis', type: 'assignment', assignmentId: 2002, isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 303,
    code: 'HIST 110',
    name: 'Modern World History: 1750 to Present',
    term: 'Fall 2026',
    instructor: 'Prof. Clara Higgins',
    instructorEmail: 'c.higgins@apex.edu',
    department: 'History',
    progressPercent: 40,
    color: 'from-amber-600 to-rose-700',
    announcements: [
      {
        id: 4,
        courseId: 303,
        courseCode: 'HIST 110',
        title: 'Primary Source Archive Access for Term Essay',
        author: 'Prof. Clara Higgins',
        authorRole: 'Professor',
        publishedAt: '2026-08-21T16:45:00Z',
        content: 'The British Library archival scan links have been updated in the library guide. Ensure you consult at least 3 primary source documents for your thesis essay.',
        isPinned: false
      }
    ],
    forums: [],
    sections: [
      {
        id: 5,
        title: 'Part 1: The Industrial Revolution & Socioeconomic Transformation',
        summary: 'Mechanization, labor dynamics, urbanization, and global capital flow.',
        items: [
          { id: 301, title: 'Primary Source: Factory Acts of 1833 Testimony', type: 'resource', isCompleted: true },
          { id: 302, title: 'Term Essay 1: Industrialization and Living Standards', type: 'assignment', assignmentId: 3001, isCompleted: false }
        ]
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 1001,
    courseId: 101,
    courseCode: 'CS 101',
    courseName: 'Introduction to Artificial Intelligence',
    title: 'Lab 1: Implementing Heuristic Pathfinding',
    description: 'Implement A* search with Euclidean and Manhattan distance heuristics on 2D grid mazes. Submit your Python code and a short 1-page report.',
    dueDate: '2026-08-18T23:59:00Z',
    pointsPossible: 100,
    submissionStatus: 'graded',
    currentGrade: 98,
    submittedAt: '2026-08-17T20:15:00Z'
  },
  {
    id: 1002,
    courseId: 101,
    courseCode: 'CS 101',
    courseName: 'Introduction to Artificial Intelligence',
    title: 'Assignment 2: Ethics of Autonomous Agent Systems',
    description: 'Write a 1,200 to 1,500-word critical analysis evaluating autonomous tool execution by LLMs on the web. Compare Utilitarian and Deontological safety approaches, address prompt injection vulnerabilities, and propose a human-in-the-loop governance mechanism.',
    dueDate: '2026-08-29T23:59:00Z',
    pointsPossible: 100,
    submissionStatus: 'draft',
    draftText: `# Autonomous Web Agents: Reconciling Utility and Deontological Safeguards

## 1. Introduction
The advent of in-browser agent protocols, such as WebMCP (document.modelContext), enables artificial intelligence systems to transition from passive text generators to active digital actors capable of executing tasks on behalf of users. While this transition unlocks profound productivity gains, it introduces significant ethical dilemmas concerning agency, user consent, and accountability.

## 2. Ethical Framework Comparison
From a Utilitarian perspective, autonomous agent adoption is justified by the aggregate minimization of routine labor and cognitive friction across millions of knowledge workers. If an agent saves a student 5 hours weekly in navigating dense administrative interfaces, the net societal utility is positive.

However, Deontological ethics demands that individuals are never treated merely as instruments of automation. An agent acting autonomously without explicit confirmation for high-stakes decisions violates user autonomy. For instance, when an agent schedules a medical appointment or submits a legal form, failure to present an actionable confirmation modal infringes upon the duty of informed consent.

## 3. Threat Modeling & Governance
A key challenge in client-side agent execution is prompt injection. Adversarial webpages can embed invisible directives designed to hijack the model's context window. To mitigate this risk, browser environments must enforce strict trust boundaries:
1. Low-consequence read queries (e.g. fetching syllabi) may execute with optimistic autonomy.
2. Irreversible write operations (e.g. final assignment submission, financial commitments) must trigger a verifiable human-in-the-loop gate.`,
    rubric: {
      id: 'rubric-cs101-a2',
      title: 'CS 101 Assignment 2 Evaluation Rubric',
      totalPoints: 100,
      criteria: [
        {
          id: 'crit-ethical-frameworks',
          title: 'Ethical Framework Application',
          description: 'Depth, accuracy, and comparative analysis using established philosophical frameworks (e.g., Utilitarianism, Deontology, Virtue Ethics).',
          weightPoints: 35,
          levels: [
            { id: 'ef-4', score: 35, label: 'Exemplary', description: 'Rigorous, nuanced comparison of 2+ frameworks with direct application to modern autonomous systems.' },
            { id: 'ef-3', score: 28, label: 'Proficient', description: 'Accurate comparison of frameworks with clear relevance, minor gaps in synthesis.' },
            { id: 'ef-2', score: 20, label: 'Developing', description: 'Mentions frameworks superficially without deep analytical contrast.' },
            { id: 'ef-1', score: 10, label: 'Unacceptable', description: 'No clear philosophical frameworks utilized.' }
          ]
        },
        {
          id: 'crit-technical-accuracy',
          title: 'Technical Depth & Web Protocol Understanding',
          description: 'Factual understanding of tool calling, client-side execution, prompt injection, and browser trust boundaries.',
          weightPoints: 35,
          levels: [
            { id: 'ta-4', score: 35, label: 'Exemplary', description: 'Detailed technical understanding of WebMCP/agent architectures and realistic threat models.' },
            { id: 'ta-3', score: 28, label: 'Proficient', description: 'Solid explanation of agent mechanics with basic security considerations.' },
            { id: 'ta-2', score: 20, label: 'Developing', description: 'Vague or partially inaccurate description of agent capabilities.' },
            { id: 'ta-1', score: 10, label: 'Unacceptable', description: 'Major technical misconceptions.' }
          ]
        },
        {
          id: 'crit-governance-proposal',
          title: 'Governance & Human-in-the-Loop Proposal',
          description: 'Practicality, novelty, and clarity of the proposed oversight and safety mechanism.',
          weightPoints: 20,
          levels: [
            { id: 'gov-4', score: 20, label: 'Exemplary', description: 'Specific, actionable multi-tier confirmation mechanism balancing safety and speed.' },
            { id: 'gov-3', score: 16, label: 'Proficient', description: 'Reasonable governance proposal with clear confirmation boundaries.' },
            { id: 'gov-2', score: 12, label: 'Developing', description: 'Generic proposal lacking operational specifics.' },
            { id: 'gov-1', score: 5, label: 'Unacceptable', description: 'Missing governance recommendation.' }
          ]
        },
        {
          id: 'crit-clarity-citations',
          title: 'Clarity, Structure & Academic Citations',
          description: 'Flow, prose quality, logical organization, and adherence to standard academic citation format.',
          weightPoints: 10,
          levels: [
            { id: 'cc-4', score: 10, label: 'Exemplary', description: 'Impeccable academic prose, clear structural progression, proper formatting.' },
            { id: 'cc-3', score: 8, label: 'Proficient', description: 'Clear and readable with minor stylistic flaws.' },
            { id: 'cc-2', score: 5, label: 'Developing', description: 'Disorganized sections or rough transitions.' },
            { id: 'cc-1', score: 2, label: 'Unacceptable', description: 'Unstructured or poorly written.' }
          ]
        }
      ]
    }
  },
  {
    id: 2001,
    courseId: 202,
    courseCode: 'BIO 200',
    courseName: 'Molecular & Cellular Genetics',
    title: 'Lab 1: Polymerase Chain Reaction Assay',
    description: 'PCR amplification protocol report and thermal cycle curve analysis.',
    dueDate: '2026-08-20T23:59:00Z',
    pointsPossible: 50,
    submissionStatus: 'graded',
    currentGrade: 47,
    submittedAt: '2026-08-19T18:00:00Z'
  },
  {
    id: 2002,
    courseId: 202,
    courseCode: 'BIO 200',
    courseName: 'Molecular & Cellular Genetics',
    title: 'Lab 2: CRISPR Target Site Selectivity Analysis',
    description: 'Design single-guide RNAs (sgRNAs) targeting exon 3 of human hemoglobin subunit beta (HBB). Report on on-target efficiency scores and off-target cleavage probabilities calculated via deep sequencing.',
    dueDate: '2026-09-01T23:59:00Z',
    pointsPossible: 100,
    submissionStatus: 'unsubmitted',
    rubric: {
      id: 'rubric-bio200-l2',
      title: 'BIO 200 Lab 2 Evaluation Matrix',
      totalPoints: 100,
      criteria: [
        {
          id: 'bio-crit-sgrna',
          title: 'sgRNA Design & Pam Site Identification',
          description: 'Correct identification of NGG PAM sites and optimal 20-nt guide sequence selection.',
          weightPoints: 30,
          levels: [
            { id: 'b1-4', score: 30, label: 'Exemplary', description: 'Optimal guide selection with zero off-target homology in coding regions.' },
            { id: 'b1-3', score: 24, label: 'Proficient', description: 'Valid guide sequence with minor secondary off-target risk.' },
            { id: 'b1-2', score: 15, label: 'Developing', description: 'Suboptimal guide targeting intron boundary.' }
          ]
        },
        {
          id: 'bio-crit-cleavage',
          title: 'Off-Target Probability & Mismatch Quantification',
          description: 'Accurate application of CFD scoring algorithm for off-target estimation.',
          weightPoints: 40,
          levels: [
            { id: 'b2-4', score: 40, label: 'Exemplary', description: 'Complete genome-wide alignment and CFD cleavage probability matrix provided.' },
            { id: 'b2-3', score: 32, label: 'Proficient', description: 'Identified top 5 off-target candidates with acceptable scoring.' },
            { id: 'b2-2', score: 20, label: 'Developing', description: 'Incomplete off-target analysis.' }
          ]
        },
        {
          id: 'bio-crit-discussion',
          title: 'Experimental Protocol & Error Mitigation',
          description: 'Controls, electroporation conditions, and verification via T7 Endonuclease I assay.',
          weightPoints: 30,
          levels: [
            { id: 'b3-4', score: 30, label: 'Exemplary', description: 'Comprehensive experimental design with positive and negative controls.' },
            { id: 'b3-3', score: 24, label: 'Proficient', description: 'Standard protocol with adequate control considerations.' },
            { id: 'b3-2', score: 15, label: 'Developing', description: 'Missing negative control design.' }
          ]
        }
      ]
    }
  },
  {
    id: 3001,
    courseId: 303,
    courseCode: 'HIST 110',
    courseName: 'Modern World History: 1750 to Present',
    title: 'Term Essay 1: Industrialization and Living Standards',
    description: 'Compare the standard of living debate between optimistic and pessimistic historiographies regarding British working-class wages, health, and urbanization between 1780 and 1850.',
    dueDate: '2026-09-04T23:59:00Z',
    pointsPossible: 100,
    submissionStatus: 'unsubmitted',
    rubric: {
      id: 'rubric-hist110-e1',
      title: 'HIST 110 Essay 1 Rubric',
      totalPoints: 100,
      criteria: [
        {
          id: 'hist-crit-thesis',
          title: 'Thesis Clarity & Historiographical Stance',
          description: 'Clear, argumentative thesis engaging with Hartwell, Hobsbawm, or Thompson.',
          weightPoints: 35,
          levels: [
            { id: 'h1-4', score: 35, label: 'Exemplary', description: 'Compelling thesis that integrates both real-wage data and quality-of-life indices.' },
            { id: 'h1-3', score: 28, label: 'Proficient', description: 'Clear thesis taking a defined historical stance.' },
            { id: 'h1-2', score: 18, label: 'Developing', description: 'Descriptive summary rather than an argumentative thesis.' }
          ]
        },
        {
          id: 'hist-crit-sources',
          title: 'Primary & Secondary Source Integration',
          description: 'Synthesis of parliamentary reports, parish records, and historical monographs.',
          weightPoints: 45,
          levels: [
            { id: 'h2-4', score: 45, label: 'Exemplary', description: 'Skillful integration of 4+ primary sources and contemporary historiography.' },
            { id: 'h2-3', score: 36, label: 'Proficient', description: 'Uses 2-3 primary sources effectively.' },
            { id: 'h2-2', score: 22, label: 'Developing', description: 'Relies predominantly on tertiary or textbook summaries.' }
          ]
        },
        {
          id: 'hist-crit-chicago',
          title: 'Chicago Turabian Citation Format',
          description: 'Footnotes and bibliographic adherence to Chicago Manual of Style.',
          weightPoints: 20,
          levels: [
            { id: 'h3-4', score: 20, label: 'Exemplary', description: 'Accurate footnote citations and bibliography.' },
            { id: 'h3-3', score: 16, label: 'Proficient', description: 'Minor punctuation inconsistencies in notes.' },
            { id: 'h3-2', score: 10, label: 'Developing', description: 'Incorrect citation format (e.g. APA used instead of Chicago).' }
          ]
        }
      ]
    }
  }
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 501,
    assignmentId: 1002,
    studentId: 'student-alex',
    studentName: 'Alex Rivera',
    submittedAt: '2026-08-26T20:00:00Z',
    content: INITIAL_ASSIGNMENTS[1].draftText || '',
    status: 'submitted'
  },
  {
    id: 502,
    assignmentId: 1002,
    studentId: 'student-marcus',
    studentName: 'Marcus Vance',
    submittedAt: '2026-08-25T16:30:00Z',
    content: 'My paper covers how autonomous agents might displace web development jobs and why companies need retraining programs.',
    status: 'submitted'
  },
  {
    id: 503,
    assignmentId: 1002,
    studentId: 'student-chloe',
    studentName: 'Chloe Bennett',
    submittedAt: '2026-08-24T12:00:00Z',
    content: 'A detailed review of prompt injection attacks against LLM agents using indirect web scraping payload vectors.',
    status: 'graded',
    grade: 94,
    feedback: 'Excellent breakdown of indirect prompt injection vectors. Strong application of Deontological responsibility.'
  }
];

