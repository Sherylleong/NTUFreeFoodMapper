import { NextResponse } from 'next/server';
import { CategoryDataRow, CategoryMainSubDataRow, queryFiltersProcessedDataCategoryMainSubStatistics, queryFiltersProcessedDataCategoryStatistics } from '../../helpers/db_helper';
import {FiltersType} from "../../helpers/db_helper";

export async function POST(req: Request) {
  try {
    const filters: FiltersType = await req.json(); // filters coming from the POST request body

    // validate filters
    if (!filters || !filters.daysOfWeek || !filters.dateRange || !filters.timeRange) {
      return NextResponse.json({ error: 'Missing required filters' }, { status: 400 });
    }

    // call the query function to fetch the filtered data
    const dataByCategoryMainSub: CategoryMainSubDataRow[] = await queryFiltersProcessedDataCategoryMainSubStatistics(filters);

    // Return the filtered data as JSON
    return NextResponse.json(dataByCategoryMainSub, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching location statistics:', error);
    return NextResponse.json({ error: 'Error fetching location statistics' }, { status: 500 });
  }
} 