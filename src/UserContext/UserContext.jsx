import React, { createContext } from 'react'
export const DataContext = createContext();
const UserContext = ({children}) => {
    const userdata = [
  {
    "id": 1,
    "name": "Aarav Sharma",
    "age": 29,
    "gender": "Male",
    "department": "Software Development",
    "position": "Backend Developer",
    "salary": 65000,
    "email": "aarav.sharma@company.com",
    "city": "Bangalore"
  },
  {
    "id": 2,
    "name": "Neha Verma",
    "age": 32,
    "gender": "Female",
    "department": "Software Development",
    "position": "Frontend Developer",
    "salary": 63000,
    "email": "neha.verma@company.com",
    "city": "Pune"
  },
  {
    "id": 3,
    "name": "Rohit Singh",
    "age": 27,
    "gender": "Male",
    "department": "Software Development",
    "position": "Full Stack Developer",
    "salary": 72000,
    "email": "rohit.singh@company.com",
    "city": "Delhi"
  },
  {
    "id": 4,
    "name": "Priya Nair",
    "age": 30,
    "gender": "Female",
    "department": "Human Resources",
    "position": "HR Manager",
    "salary": 55000,
    "email": "priya.nair@company.com",
    "city": "Mumbai"
  },
  {
    "id": 5,
    "name": "Kunal Mehta",
    "age": 35,
    "gender": "Male",
    "department": "Finance",
    "position": "Accountant",
    "salary": 58000,
    "email": "kunal.mehta@company.com",
    "city": "Ahmedabad"
  },
  {
    "id": 6,
    "name": "Sneha Kapoor",
    "age": 28,
    "gender": "Female",
    "department": "Finance",
    "position": "Financial Analyst",
    "salary": 60000,
    "email": "sneha.kapoor@company.com",
    "city": "Chennai"
  },
  {
    "id": 7,
    "name": "Vikram Chauhan",
    "age": 31,
    "gender": "Male",
    "department": "Marketing",
    "position": "Marketing Manager",
    "salary": 70000,
    "email": "vikram.chauhan@company.com",
    "city": "Hyderabad"
  },
  {
    "id": 8,
    "name": "Meera Iyer",
    "age": 26,
    "gender": "Female",
    "department": "Marketing",
    "position": "Content Strategist",
    "salary": 52000,
    "email": "meera.iyer@company.com",
    "city": "Kolkata"
  },
  {
    "id": 9,
    "name": "Ankit Yadav",
    "age": 33,
    "gender": "Male",
    "department": "Sales",
    "position": "Sales Executive",
    "salary": 48000,
    "email": "ankit.yadav@company.com",
    "city": "Bangalore"
  },
  {
    "id": 10,
    "name": "Ritika Joshi",
    "age": 29,
    "gender": "Female",
    "department": "Sales",
    "position": "Sales Manager",
    "salary": 68000,
    "email": "ritika.joshi@company.com",
    "city": "Delhi"
  },
  {
    "id": 11,
    "name": "Harsh Patel",
    "age": 34,
    "gender": "Male",
    "department": "Customer Support",
    "position": "Support Lead",
    "salary": 45000,
    "email": "harsh.patel@company.com",
    "city": "Surat"
  },
  {
    "id": 12,
    "name": "Isha Malhotra",
    "age": 25,
    "gender": "Female",
    "department": "Customer Support",
    "position": "Support Executive",
    "salary": 35000,
    "email": "isha.malhotra@company.com",
    "city": "Jaipur"
  },
  {
    "id": 13,
    "name": "Aditya Rao",
    "age": 28,
    "gender": "Male",
    "department": "IT",
    "position": "System Administrator",
    "salary": 58000,
    "email": "aditya.rao@company.com",
    "city": "Bangalore"
  },
  {
    "id": 14,
    "name": "Sanya Khanna",
    "age": 27,
    "gender": "Female",
    "department": "IT",
    "position": "Network Engineer",
    "salary": 60000,
    "email": "sanya.khanna@company.com",
    "city": "Pune"
  },
  {
    "id": 15,
    "name": "Arjun Reddy",
    "age": 36,
    "gender": "Male",
    "department": "IT",
    "position": "IT Manager",
    "salary": 78000,
    "email": "arjun.reddy@company.com",
    "city": "Hyderabad"
  },
  {
    "id": 16,
    "name": "Divya Bansal",
    "age": 30,
    "gender": "Female",
    "department": "Admin",
    "position": "Office Administrator",
    "salary": 40000,
    "email": "divya.bansal@company.com",
    "city": "Delhi"
  },
  {
    "id": 17,
    "name": "Ramesh Kumar",
    "age": 40,
    "gender": "Male",
    "department": "Operations",
    "position": "Operations Head",
    "salary": 85000,
    "email": "ramesh.kumar@company.com",
    "city": "Mumbai"
  },
  {
    "id": 18,
    "name": "Pooja Saxena",
    "age": 29,
    "gender": "Female",
    "department": "Operations",
    "position": "Operations Executive",
    "salary": 48000,
    "email": "pooja.saxena@company.com",
    "city": "Noida"
  },
  {
    "id": 19,
    "name": "Siddharth Jain",
    "age": 32,
    "gender": "Male",
    "department": "Research & Development",
    "position": "R&D Engineer",
    "salary": 72000,
    "email": "siddharth.jain@company.com",
    "city": "Bangalore"
  },
  {
    "id": 20,
    "name": "Kavya Menon",
    "age": 27,
    "gender": "Female",
    "department": "Research & Development",
    "position": "Research Associate",
    "salary": 62000,
    "email": "kavya.menon@company.com",
    "city": "Chennai"
  },
  {
    "id": 21,
    "name": "Manish Tiwari",
    "age": 34,
    "gender": "Male",
    "department": "Legal",
    "position": "Legal Advisor",
    "salary": 78000,
    "email": "manish.tiwari@company.com",
    "city": "Delhi"
  },
  {
    "id": 22,
    "name": "Anjali Deshmukh",
    "age": 31,
    "gender": "Female",
    "department": "Legal",
    "position": "Compliance Officer",
    "salary": 65000,
    "email": "anjali.deshmukh@company.com",
    "city": "Mumbai"
  },
  {
    "id": 23,
    "name": "Nikhil Gupta",
    "age": 29,
    "gender": "Male",
    "department": "Procurement",
    "position": "Procurement Specialist",
    "salary": 56000,
    "email": "nikhil.gupta@company.com",
    "city": "Pune"
  },
  {
    "id": 24,
    "name": "Shreya Ghosh",
    "age": 26,
    "gender": "Female",
    "department": "Procurement",
    "position": "Procurement Executive",
    "salary": 45000,
    "email": "shreya.ghosh@company.com",
    "city": "Kolkata"
  },
  {
    "id": 25,
    "name": "Varun Kapoor",
    "age": 37,
    "gender": "Male",
    "department": "Management",
    "position": "General Manager",
    "salary": 120000,
    "email": "varun.kapoor@company.com",
    "city": "Gurgaon"
  },
  {
    "id": 26,
    "name": "Simran Kaur",
    "age": 28,
    "gender": "Female",
    "department": "Design",
    "position": "UI/UX Designer",
    "salary": 64000,
    "email": "simran.kaur@company.com",
    "city": "Chandigarh"
  },
  {
    "id": 27,
    "name": "Akash Mishra",
    "age": 30,
    "gender": "Male",
    "department": "Design",
    "position": "Graphic Designer",
    "salary": 52000,
    "email": "akash.mishra@company.com",
    "city": "Lucknow"
  },
  {
    "id": 28,
    "name": "Tanya Arora",
    "age": 27,
    "gender": "Female",
    "department": "Public Relations",
    "position": "PR Executive",
    "salary": 47000,
    "email": "tanya.arora@company.com",
    "city": "Delhi"
  },
  {
    "id": 29,
    "name": "Deepak Joshi",
    "age": 35,
    "gender": "Male",
    "department": "Public Relations",
    "position": "PR Manager",
    "salary": 69000,
    "email": "deepak.joshi@company.com",
    "city": "Mumbai"
  },
  {
    "id": 30,
    "name": "Radhika Pillai",
    "age": 33,
    "gender": "Female",
    "department": "Training",
    "position": "Corporate Trainer",
    "salary": 75000,
    "email": "radhika.pillai@company.com",
    "city": "Bangalore"
  }
]
  return (
    <div>
        <DataContext.Provider value={userdata}>
            {children}
        </DataContext.Provider>
    </div>
  )
}

export default UserContext