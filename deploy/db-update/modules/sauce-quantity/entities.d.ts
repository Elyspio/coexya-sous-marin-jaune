export interface Order {
	_id: string;
	Burgers: Burger[];
	User: string;
	Date: string;
	Student: boolean;
	Drink: string;
	Fries: Fries;
	Dessert: null;
	Payments: Payment[];
	PaymentEnabled: boolean;
}

export interface Burger {
	Name: string;
	Excluded: string[];
	Vegetarian: boolean;
	Xl: boolean;
	Comment: null;
}

export interface Fries {
	Sauces: string[];
}

export interface Payment {
	Type: string;
	Amount: number;
	Received: number;
}
