const BASE_URL = "https://app.code-quests.com/api";

interface CQPaginatedResponse<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export interface CQCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  coverImg: string | null;
}

export interface CQQuest {
  id: number;
  title: string;
  status: string;
  type: string;
  phase: string;
  heroImg: string | null;
  createdOn: string;
  publishedOn: string;
  registrationDeadline: string | null;
  submissionDeadline: string | null;
  location: string | null;
  isPublic: boolean;
  isHiring: boolean;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  minExperience: number | null;
  maxExperience: number | null;
  hiringType: string | null;
  workingStatus: string | null;
  categoryId: number;
  technologies: string[];
  category: CQCategory;
  org: {
    name: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    isVerified: boolean;
  };
}

/**
 * Fetch all pages from a paginated Code Quests API endpoint.
 */
async function fetchAllPages<T>(url: string): Promise<T[]> {
  const all: T[] = [];
  let skip = 0;
  const limit = 50;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const separator = url.includes("?") ? "&" : "?";
    const pageUrl = `${url}${separator}$limit=${limit}&$skip=${skip}`;
    const res = await fetch(pageUrl);

    if (!res.ok) {
      throw new Error(`Code Quests API error: ${res.status} ${res.statusText}`);
    }

    const json: CQPaginatedResponse<T> = await res.json();
    all.push(...json.data);

    if (all.length >= json.total) break;
    skip += limit;
  }

  return all;
}

/**
 * Fetch all categories from Code Quests.
 */
export async function fetchAllCategories(): Promise<CQCategory[]> {
  return fetchAllPages<CQCategory>(`${BASE_URL}/categories`);
}

/**
 * Fetch all quests in "registration" phase that are hiring.
 */
export async function fetchRegistrationQuests(): Promise<CQQuest[]> {
  return fetchAllPages<CQQuest>(
    `${BASE_URL}/quests?isHiring=true&phase=registration&$sort[id]=-1`
  );
}
