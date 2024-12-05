const colors = [
  [
    'bg-white',
    'bg-black',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
  ],
  [
    'bg-red',
    'bg-red-soft',
    'bg-red-50',
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'bg-red-800',
    'bg-red-900',
  ],
  [
    'bg-orange',
    'bg-orange-soft',
    'bg-orange-50',
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-orange-800',
    'bg-orange-900',
  ],
  [
    'bg-yellow',
    'bg-yellow-soft',
    'bg-yellow-50',
    'bg-yellow-100',
    'bg-yellow-200',
    'bg-yellow-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-yellow-700',
    'bg-yellow-800',
    'bg-yellow-900',
  ],
  [
    'bg-blue',
    'bg-blue-soft',
    'bg-blue-50',
    'bg-blue-100',
    'bg-blue-200',
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'bg-blue-800',
    'bg-blue-900',
  ],
  [
    'bg-green',
    'bg-green-soft',
    'bg-green-50',
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
  ],
  [
    'bg-indigo',
    'bg-indigo-soft',
    'bg-indigo-50',
    'bg-indigo-100',
    'bg-indigo-200',
    'bg-indigo-300',
    'bg-indigo-400',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-indigo-700',
    'bg-indigo-800',
    'bg-indigo-900',
  ],
];

export default function Colors() {
  return (
    <div className="flex gap-4">
      {colors.map((group, groupIndex) => (
        <div key={groupIndex} className="w-full">
          {group.map((c, colorIndex) => (
            <div key={colorIndex}>
              <label className="mb-1 mt-3 block text-xs text-gray-400">
                {c}
              </label>
              <div className={`${c} aspect-1 w-full flex-1 rounded`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}