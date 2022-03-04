import { FC } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy";

ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

interface Props {
  data: { label: string, value: string }[]
}

const ChartComponent: FC<Props> = ({ data }) => {
  const chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: 'Stars Per Language',
        decimals: 0,
        pieRadius: "45%",
        showpercentvalues: 0,
        theme: 'candy',
      },
      data
    }
  };
  return (<ReactFC {...chartConfigs} />)
}

export default ChartComponent;