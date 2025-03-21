import { addOns } from '../data/addOns';

export default function AddOnsSection() {
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-medium text-center mb-12">ADD-ONS</h2>
      
      <div className="max-w-2xl mx-auto">
        <ul className="space-y-3 text-center">
          {addOns.map((addOn: string, index: number) => (
            <li key={index} className="text-gray-700">
              {addOn}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 