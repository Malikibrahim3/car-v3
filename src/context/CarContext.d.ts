export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  purchasePrice: number;
  currentValue?: number;
  apiCalibratedValue?: number;
  ownershipType: 'cash' | 'loan' | 'lease' | 'pcp';
  loanAmount?: number;
  monthlyPayment?: number;
  deposit?: number;
  interestRate?: number;
  loanTerm?: number;
  startDate?: string;
  imageUrl?: string;
}

export interface CarContextType {
  cars: Car[];
  loading: boolean;
  isDemoMode: boolean;
  addCar: (car: Omit<Car, 'id'>) => Promise<void>;
  updateCar: (id: string, updates: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  toggleDemoMode: () => void;
}

export function useCarContext(): CarContextType;
export const CarProvider: React.FC<{ children: React.ReactNode }>;
