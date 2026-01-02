const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        {trend && (
          <p className="text-xs text-green-600 font-medium mt-2">
            ↑ {trend} vs last month
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);