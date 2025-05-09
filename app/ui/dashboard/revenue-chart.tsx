import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';
// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue = await fetchRevenue();
  const chartHeight = 350;
  
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent>
          <p className="text-gray-400">暂无数据</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:col-span-4">
      <CardHeader>
        <CardTitle className={`text-xl md:text-2xl`}>
        Recent Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
            <div
              className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
              style={{ height: `${chartHeight}px` }}
            >
              {yAxisLabels.map((label) => (
                <p key={label}>{label}</p>
              ))}
            </div>

            {revenue.map((month:any) => (
              <div key={month.month} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-md bg-blue-300"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                ></div>
                <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                  {month.month}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center pb-2 pt-6">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <h3 className="ml-2 text-sm text-gray-500">Last 12 months</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
