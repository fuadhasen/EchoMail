import React from "react";
import { Card, CardContent } from "../components/ui/card";

interface Props {
  title: string;
  value: number;
}

const SummaryCards = ({ title, value }: Props) => {
  return (
    <div>
      <Card className=" border-0 shadow-sm hover:shadow-lg transiton-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                {title}
              </p>
              <h2 className="text-5xl font-extrabold mt-4 text-slate-900 tracking-light ">
                {value}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
