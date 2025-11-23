export const buses = [
    {
        id: 1,
        name: "Raida Paribahan",
        routeNo: "A-101",
        source: "Mirpur 12",
        destination: "Postogola",
        stops: ["Mirpur 12", "Mirpur 10", "Kazipara", "Agargaon", "Farmgate", "Shahbag", "Gulistan", "Postogola"],
        fare: {
            base: 10,
            perKm: 2.5
        },
        rating: 4.2,
        totalRatings: 120,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Victor Classic",
        routeNo: "B-205",
        source: "Abdullahpur",
        destination: "Sadarghat",
        stops: ["Abdullahpur", "Airport", "Banani", "Mohakhali", "Moghbazar", "Paltan", "Sadarghat"],
        fare: {
            base: 15,
            perKm: 2.2
        },
        rating: 3.8,
        totalRatings: 85,
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Bihongo",
        routeNo: "C-309",
        source: "Mirpur 1",
        destination: "Azimpur",
        stops: ["Mirpur 1", "Technical", "Kallyanpur", "Shyamoli", "Asad Gate", "New Market", "Azimpur"],
        fare: {
            base: 10,
            perKm: 2.4
        },
        rating: 4.0,
        totalRatings: 200,
        image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2070&auto=format&fit=crop"
    }
];

export const emergencyContacts = [
    {
        name: "National Emergency Service",
        number: "999",
        type: "General"
    },
    {
        name: "Fire Service HQ",
        number: "02-9555555",
        type: "Fire"
    },
    {
        name: "Dhaka Metropolitan Police",
        number: "02-9999999",
        type: "Police"
    }
];
