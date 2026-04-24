# UX Behavioral Analytics Dashboard

A lightweight, high-performance auditing tool designed to identify cognitive friction, "Dark Patterns", and drop-off points within conversion funnels. 

## 🎯 Technical Objective

Standard analytics tools tell you *what* happened. This dashboard processes raw interaction logs to hypothesize *why* it happened. Built for product managers and technical UX strategists, it strictly relies on client-side parsing to evaluate user frustration without compromising data privacy.

## 🛠️ Core Architecture

- **Logic Engine:** Vanilla JavaScript (ES6+). Zero heavy frameworks to demonstrate core language proficiency and rendering efficiency.
- **Data Parsing:** Integration with [PapaParse](https://www.papaparse.com/) for high-speed, local processing of large CSV datasets.
- **Visualization:** Dynamic rendering via [Chart.js](https://www.chartjs.org/), implementing custom mathematical callbacks (e.g., dynamic drop-off percentage calculation on hover).

## 🧠 Key Performance Indicators (KPIs) Analysed

1. **Retention Funnel (Drop-off Rate):** Identifies exact bottlenecks in the user journey. Logic accumulates downstream conversions to accurately map top-of-funnel entry versus bottom-of-funnel success.
2. **Checkout Time vs. Error Rate (Scatter Plot):** Maps the correlation between form completion time and validation errors to detect cognitive overload in UI elements.
3. **Rage Click Heatmap (Polar Area):** Isolates specific interface components (e.g., hidden checkboxes, broken carousels) generating compulsive user clicks, acting as an early warning system for usability failures.

## 🚀 Usage

No backend configuration required.
1. Clone the repository.
2. Open `dashboard.html` in any modern browser.
3. Upload the sample dataset provided in `data/funnel_test.csv` to see the logic engine parse and re-render the DOM in real-time.

---
*Developed as a hybrid approach connecting Data Analytics, UX Design, and Behavioral Psychology.*
