Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: { 
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
});

Vue.component('line-chart', {
    extends: VueChartJs.Line,
    data : function(){
        return {
            gridColumns : this.gridColumns ,
            gridData : this.gridData,
        }
    },
    mounted () {
      this.renderChart({
        labels: this.gridColumns,
        datasets: [
          {
            label: '',
            backgroundColor: '#f87979',
            data: this.gridData,
          }
        ]
      }, {responsive: true, maintainAspectRatio: false})
    }
  })

// bootstrap the demo
var demo = new Vue({
    el: '#demo',
    data: {
        arrays: [],
        searchQuery: '',
        gridColumns: [],
        gridData: []
    },
    methods: {
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.fetchcsv(files[0]);
        },
        fetchcsv(file) {
            var image = '';
            var reader = new FileReader();
            var vm = this;
            var arrays = new Array();
            reader.onload = (e) => {
                image = e.target.result;
                var testdata = image.split('\n');
                this.gridColumns = testdata[0].split(',');
                for (const line of testdata) {
                    var clmdata = line.split(',');
                    var heads = this.gridColumns;
                    var testdt = {};                   
                    clmdata.forEach((key,i) => testdt[heads[i]] = key);

                    /* testdata = heads.map( (str , i) => {
                        testdt[str] = clmdata[i];
                        return testdt;
                    }, this); */
                    
                    this.gridData.push(testdt);
                    console.log(testdt);
                }
                //vm.arrays = image.split('\n');
            };
            reader.readAsBinaryString(file);
        },
        removeImage: function (e) {
            this.arrays = [];
        }
    }
})