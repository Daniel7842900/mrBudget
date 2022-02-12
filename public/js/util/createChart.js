createChart = (target, chartType, data, labels, financeType) => {
  const barColor = ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"];
  const pieColor = [
    "rgba(244, 87, 75, 0.8)",
    "rgba(244, 161, 75, 0.8)",
    "rgba(244, 207, 75, 0.8)",
    "rgba(75, 244, 144, 0.8)",
    "rgba(75, 244, 239, 0.8)",
    "rgba(75, 165, 244, 0.8)",
    "rgba(126, 75, 244, 0.8)",
    "rgba(244, 75, 144, 0.8)",
    "rgba(99, 52, 60, 0.8)",
    "rgba(52, 64, 99, 0.8)",
    "rgba(150, 157, 88, 0.8)",
    "rgba(189, 166, 116, 0.8)",
    "rgba(175, 151, 129, 0.8)",
    "rgba(125, 125, 129, 0.8)",
  ];
  const myChart = new Chart(target, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [
        {
          label: chartType === "bar" ? "Total" : null,
          data: data,
          backgroundColor: chartType === "bar" ? barColor : pieColor,
          borderColor: chartType === "bar" ? barColor : pieColor,
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: financeType !== null ? financeType : null,
        },
      },
    },
  });
  return myChart;
};
