import { FC } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

interface Props {
  data: { label: string, value: string }[]
}

const ChartComponent: FC<Props> = ({ data }) => {
  const chartConfigs = {
    type: "pie3d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: 'Languages',
        theme: 'fusion',
        decimals: 0,
        pieRadius: "45%"
      },
      data
    }
  };
  return (<ReactFC {...chartConfigs} />)
}

export default ChartComponent;