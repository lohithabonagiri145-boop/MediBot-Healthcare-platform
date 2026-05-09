// Generate Synthetic Healthcare Dataset
function generateHealthcareData() {
    const diseases = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Gastroenterology'];
    const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Emergency'];
    const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Lee', 'Dr. Patel', 'Dr. Garcia', 'Dr. Kim'];
    const branches = ['Main Hospital', 'East Wing', 'West Wing', 'North Branch', 'South Branch'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    const insuranceTypes = ['Private', 'Medicare', 'Medicaid', 'None'];
    const recoveryStatuses = ['Recovered', 'Recovering', 'Critical', 'Discharged'];

    const data = [];
    const startDate = new Date('2024-01-01');
    
    for (let i = 1; i <= 1000; i++) {
        const admissionDate = new Date(startDate);
        admissionDate.setDate(startDate.getDate() + Math.floor(Math.random() * 365 * 2));
        const dischargeDate = new Date(admissionDate);
        dischargeDate.setDate(admissionDate.getDate() + 3 + Math.floor(Math.random() * 20));
        
        data.push({
            patientId: `P${String(i).padStart(4, '0')}`,
            patientName: `Patient ${i}`,
            age: Math.floor(Math.random() * 70) + 15,
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            diseaseType: diseases[Math.floor(Math.random() * diseases.length)],
            department: departments[Math.floor(Math.random() * departments.length)],
            doctorAssigned: doctors[Math.floor(Math.random() * doctors.length)],
            admissionDate: admissionDate.toISOString().split('T')[0],
            dischargeDate: dischargeDate.toISOString().split('T')[0],
            treatmentCost: Math.floor((Math.random() * 50000 + 5000) / 100) * 100,
            recoveryStatus: recoveryStatuses[Math.floor(Math.random() * recoveryStatuses.length)],
            hospitalBranch: branches[Math.floor(Math.random() * branches.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            bedOccupancy: Math.floor(Math.random() * 10) + 1,
            patientSatisfactionScore: (Math.random() * 3 + 2).toFixed(1),
            insuranceType: insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)]
        });
    }
    return data;
}

// Global Variables
let healthcareData = generateHealthcareData();
let filteredData = [...healthcareData];

// Theme utilities for Plotly
function getChartTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    return {
        textColor: isDark ? '#f1f1f1' : '#333',
        gridColor: isDark ? '#333' : '#e1e5e9',
        paperBg: 'rgba(0,0,0,0)',
        plotBg: 'rgba(0,0,0,0)'
    };
}

// Initialize Filters
function initializeFilters() {
    const departments = [...new Set(healthcareData.map(d => d.department))].sort();
    const diseases = [...new Set(healthcareData.map(d => d.diseaseType))].sort();
    const branches = [...new Set(healthcareData.map(d => d.hospitalBranch))].sort();
    const recoveries = [...new Set(healthcareData.map(d => d.recoveryStatus))].sort();

    const departmentFilter = document.getElementById('departmentFilter');
    const diseaseFilter = document.getElementById('diseaseFilter');
    const branchFilter = document.getElementById('branchFilter');
    const recoveryFilter = document.getElementById('recoveryFilter');

    departments.forEach(dept => {
        departmentFilter.innerHTML += `<option value="${dept}">${dept}</option>`;
    });
    diseases.forEach(disease => {
        diseaseFilter.innerHTML += `<option value="${disease}">${disease}</option>`;
    });
    branches.forEach(branch => {
        branchFilter.innerHTML += `<option value="${branch}">${branch}</option>`;
    });
    recoveries.forEach(recovery => {
        recoveryFilter.innerHTML += `<option value="${recovery}">${recovery}</option>`;
    });
}

// Filter Data Function
function filterData() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const diseaseFilter = document.getElementById('diseaseFilter').value;
    const branchFilter = document.getElementById('branchFilter').value;
    const recoveryFilter = document.getElementById('recoveryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dateRange = document.getElementById('dateRange').value;

    filteredData = healthcareData.filter(patient => {
        return (!departmentFilter || patient.department === departmentFilter) &&
               (!diseaseFilter || patient.diseaseType === diseaseFilter) &&
               (!branchFilter || patient.hospitalBranch === branchFilter) &&
               (!recoveryFilter || patient.recoveryStatus === recoveryFilter) &&
               (!searchTerm || 
                patient.patientName.toLowerCase().includes(searchTerm) ||
                patient.patientId.toLowerCase().includes(searchTerm)) &&
               (!dateRange || patient.admissionDate.startsWith(dateRange));
    });

    updateDashboard();
}

// Update KPI Cards
function updateKPIs() {
    const totalPatients = filteredData.length;
    const totalCost = filteredData.reduce((sum, patient) => sum + patient.treatmentCost, 0);
    const avgCost = totalPatients ? (totalCost / totalPatients).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '$0';
    const recovered = filteredData.filter(p => p.recoveryStatus === 'Recovered').length;
    const recoveryRate = totalPatients ? ((recovered / totalPatients) * 100).toFixed(1) + '%' : '0%';
    const avgSatisfaction = totalPatients ? 
        (filteredData.reduce((sum, p) => sum + parseFloat(p.patientSatisfactionScore), 0) / totalPatients).toFixed(1) : '0';

    document.getElementById('totalPatients').textContent = totalPatients.toLocaleString();
    document.getElementById('avgCost').textContent = avgCost;
    document.getElementById('recoveryRate').textContent = recoveryRate;
    document.getElementById('avgSatisfaction').textContent = avgSatisfaction;
}

// Update Charts
function updateCharts() {
    updateBarChart();
    updateLineChart();
    updatePieChart();
    updateScatterChart();
}

// Bar Chart: Patients by Department
function updateBarChart() {
    const deptCounts = {};
    filteredData.forEach(patient => {
        deptCounts[patient.department] = (deptCounts[patient.department] || 0) + 1;
    });

    const theme = getChartTheme();

    const trace = {
        x: Object.keys(deptCounts),
        y: Object.values(deptCounts),
        type: 'bar',
        marker: { color: '#4facfe' },
        hovertemplate: '%{x}: %{y} patients<extra></extra>'
    };

    const layout = {
        title: { text: '', font: { size: 0 } },
        xaxis: { title: 'Department', color: theme.textColor, gridcolor: theme.gridColor },
        yaxis: { title: 'Number of Patients', color: theme.textColor, gridcolor: theme.gridColor },
        margin: { t: 0, b: 40, l: 40, r: 0 },
        paper_bgcolor: theme.paperBg,
        plot_bgcolor: theme.plotBg,
        font: { color: theme.textColor }
    };

    Plotly.newPlot('barChart', [trace], layout, { responsive: true });
}

// Line Chart: Monthly Admissions
function updateLineChart() {
    const monthlyData = {};
    filteredData.forEach(patient => {
        const month = patient.admissionDate.substring(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const theme = getChartTheme();
    const sortedMonths = Object.keys(monthlyData).sort();
    const trace = {
        x: sortedMonths,
        y: sortedMonths.map(month => monthlyData[month]),
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#ef4444', width: 3 },
        marker: { size: 8 },
        hovertemplate: '%{x}: %{y} admissions<extra></extra>'
    };

    const layout = {
        title: { text: '', font: { size: 0 } },
        xaxis: { title: 'Month', color: theme.textColor, gridcolor: theme.gridColor },
        yaxis: { title: 'Admissions', color: theme.textColor, gridcolor: theme.gridColor },
        margin: { t: 0, b: 40, l: 40, r: 0 },
        paper_bgcolor: theme.paperBg,
        plot_bgcolor: theme.plotBg,
        font: { color: theme.textColor }
    };

    Plotly.newPlot('lineChart', [trace], layout, { responsive: true });
}

// Pie Chart: Recovery Status
function updatePieChart() {
    const statusCounts = {};
    filteredData.forEach(patient => {
        statusCounts[patient.recoveryStatus] = (statusCounts[patient.recoveryStatus] || 0) + 1;
    });

    const theme = getChartTheme();
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#4facfe'];

    const trace = {
        labels: Object.keys(statusCounts),
        values: Object.values(statusCounts),
        type: 'pie',
        marker: { colors: colors },
        textinfo: 'label+percent',
        textposition: 'inside',
        hovertemplate: '%{label}: %{value} patients (%{percent})<extra></extra>'
    };

    const layout = {
        title: { text: '', font: { size: 0 } },
        margin: { t: 20, b: 20, l: 20, r: 20 },
        paper_bgcolor: theme.paperBg,
        plot_bgcolor: theme.plotBg,
        font: { color: theme.textColor },
        height: 350,
        showlegend: false
    };

    Plotly.newPlot('pieChart', [trace], layout, { responsive: true });
}

// Scatter Plot: Cost vs Satisfaction
function updateScatterChart() {
    const theme = getChartTheme();
    const trace = {
        x: filteredData.map(p => p.treatmentCost),
        y: filteredData.map(p => parseFloat(p.patientSatisfactionScore)),
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: filteredData.map(p => p.recoveryStatus === 'Recovered' ? '#10b981' : '#ef4444'),
            size: 8,
            line: { color: theme.textColor, width: 0.5 }
        },
        hovertemplate: 
            'Cost: $%{x:,.0f}<br>' +
            'Satisfaction: %{y}<br>' +
            'Patient: %{text}<extra></extra>',
        text: filteredData.map(p => `${p.patientName} (${p.patientId})`)
    };

    const layout = {
        title: { text: '', font: { size: 0 } },
        xaxis: { title: 'Treatment Cost ($)', color: theme.textColor, gridcolor: theme.gridColor },
        yaxis: { title: 'Satisfaction Score', color: theme.textColor, gridcolor: theme.gridColor },
        margin: { t: 0, b: 40, l: 40, r: 0 },
        paper_bgcolor: theme.paperBg,
        plot_bgcolor: theme.plotBg,
        font: { color: theme.textColor }
    };

    Plotly.newPlot('scatterChart', [trace], layout, { responsive: true });
}

// Update Entire Dashboard
function updateDashboard() {
    updateKPIs();
    updateCharts();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    updateDashboard();

    // Filter event listeners
    ['departmentFilter', 'diseaseFilter', 'branchFilter', 'recoveryFilter', 'dateRange'].forEach(id => {
        document.getElementById(id).addEventListener('change', filterData);
    });

    document.getElementById('searchInput').addEventListener('input', filterData);

    // Watch for theme changes to redraw charts
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateCharts();
            }
        });
    });
    observer.observe(document.body, { attributes: true });

    // Handle window resize
    window.addEventListener('resize', () => {
        Plotly.Plots.resize('barChart');
        Plotly.Plots.resize('lineChart');
        Plotly.Plots.resize('pieChart');
        Plotly.Plots.resize('scatterChart');
    });
});

// Debounce search input
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterData, 300);
});
