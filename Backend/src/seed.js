import mongoose from 'mongoose';
import 'dotenv/config';
import Station from './models/station.model.js';
import MetroLine from './models/line.model.js';
import Train from './models/train.model.js';
import Schedule from './models/schedule.model.js';
import Ticket from './models/ticket.model.js';
import News from './models/news.model.js'; // Fixed typo in import (news.model.js)
import Progress from './models/progress.model.js';
import fs from 'fs';

const logFile = 'seed_log.txt';
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const seedData = async () => {
    try {
        fs.writeFileSync(logFile, "Starting seed...\n");
        await mongoose.connect(process.env.MONGO_URI);
        log("✅ Connected to MongoDB");

        // CLEANUP
        log("Cleaning up old data...");
        await Promise.all([
            Station.deleteMany({}),
            MetroLine.deleteMany({}),
            Train.deleteMany({}),
            Schedule.deleteMany({}),
            Ticket.deleteMany({}),
            News.deleteMany({}),
            Progress.deleteMany({})
        ]);

        log("Creating new data...");

        // ==========================================
        // 1. DATA PREPARATION (Lines & Stations)
        // ==========================================

        const stationsLine1 = [
            { name: "Ben Thanh", nameVi: "Bến Thành", address: "District 1", coordinates: [106.698471, 10.773237], isUnderground: true, isInterchange: true, status: 'operational' },
            { name: "Opera House", nameVi: "Nhà Hát Thành Phố", address: "District 1", coordinates: [106.701685, 10.776830], isUnderground: true, status: 'operational' },
            { name: "Ba Son", nameVi: "Ba Son", address: "District 1", coordinates: [106.705928, 10.786654], isUnderground: true, status: 'operational' },
            { name: "Van Thanh", nameVi: "Văn Thánh", address: "Binh Thanh", coordinates: [106.714511, 10.801131], isUnderground: false, status: 'operational' },
            { name: "Tan Cang", nameVi: "Tân Cảng", address: "Binh Thanh", coordinates: [106.719940, 10.803595], isUnderground: false, status: 'operational' },
            { name: "Thao Dien", nameVi: "Thảo Điền", address: "Thu Duc City", coordinates: [106.730584, 10.803864], isUnderground: false, status: 'operational' },
            { name: "An Phu", nameVi: "An Phú", address: "Thu Duc City", coordinates: [106.747449, 10.803864], isUnderground: false, status: 'operational' },
            { name: "Rach Chiec", nameVi: "Rạch Chiếc", address: "Thu Duc City", coordinates: [106.766760, 10.803864], isUnderground: false, status: 'operational' },
            { name: "Phuoc Long", nameVi: "Phước Long", address: "Thu Duc City", coordinates: [106.770554, 10.814576], isUnderground: false, status: 'operational' },
            { name: "Binh Thai", nameVi: "Bình Thái", address: "Thu Duc City", coordinates: [106.776647, 10.824858], isUnderground: false, status: 'operational' },
            { name: "Thu Duc", nameVi: "Thủ Đức", address: "Thu Duc City", coordinates: [106.781368, 10.832131], isUnderground: false, status: 'operational' },
            { name: "High Tech Park", nameVi: "Khu Công Nghệ Cao", address: "Thu Duc City", coordinates: [106.789179, 10.840453], isUnderground: false, status: 'operational' },
            { name: "Suoi Tien", nameVi: "Suối Tiên", address: "Thu Duc City", coordinates: [106.796388, 10.847725], isUnderground: false, status: 'operational' },
            { name: "Long Binh", nameVi: "Long Bình", address: "Thu Duc City", coordinates: [106.802868, 10.853440], isUnderground: false, isDepot: true, status: 'operational' }
        ];

        const stationsLine2 = [
            { name: "Tao Dan", nameVi: "Tao Đàn", address: "District 1", coordinates: [106.6905, 10.7745], isUnderground: true, status: 'construction' },
            { name: "Dan Chu", nameVi: "Dân Chủ", address: "District 3", coordinates: [106.6832, 10.7788], isUnderground: true, status: 'construction' },
            { name: "Hoa Hung", nameVi: "Hòa Hưng", address: "District 10", coordinates: [106.6755, 10.7812], isUnderground: true, status: 'construction' },
            { name: "Le Thi Rieng", nameVi: "Lê Thị Riêng", address: "District 10", coordinates: [106.6668, 10.7853], isUnderground: true, status: 'construction' },
            { name: "Pham Van Hai", nameVi: "Phạm Văn Hai", address: "Tan Binh", coordinates: [106.6591, 10.7915], isUnderground: true, status: 'construction' },
            { name: "Bay Hien", nameVi: "Bảy Hiền", address: "Tan Binh", coordinates: [106.6515, 10.7952], isUnderground: true, isInterchange: true, status: 'construction' },
            { name: "Nguyen Hong Dao", nameVi: "Nguyễn Hồng Đào", address: "Tan Binh", coordinates: [106.6438, 10.8005], isUnderground: true, status: 'construction' },
            { name: "Ba Queo", nameVi: "Bà Quẹo", address: "Tan Binh", coordinates: [106.6355, 10.8055], isUnderground: true, isInterchange: true, status: 'construction' },
            { name: "Pham Van Bach", nameVi: "Phạm Văn Bạch", address: "Tan Binh", coordinates: [106.6288, 10.8122], isUnderground: true, status: 'construction' },
            { name: "Tham Luong", nameVi: "Tham Lương", address: "District 12", coordinates: [106.6195, 10.8195], isUnderground: true, isDepot: true, status: 'construction' }
        ];

        const stationsLine3A = [
            { name: "Pham Ngu Lao", nameVi: "Phạm Ngũ Lão", address: "District 1", coordinates: [106.6932, 10.7688], isUnderground: true, status: 'planned' },
            { name: "Cong Hoa", nameVi: "Cộng Hòa", address: "District 3/5", coordinates: [106.6805, 10.7621], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Hung Vuong", nameVi: "Hùng Vương", address: "District 5", coordinates: [106.6701, 10.7588], isUnderground: true, status: 'planned' },
            { name: "Hong Bang", nameVi: "Hồng Bàng", address: "District 6", coordinates: [106.6555, 10.7544], isUnderground: true, status: 'planned' },
            { name: "Cay Go", nameVi: "Cây Gõ", address: "District 6", coordinates: [106.6455, 10.7522], isUnderground: true, status: 'planned' },
            { name: "Phu Lam", nameVi: "Phú Lâm", address: "District 6", coordinates: [106.6322, 10.7488], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Mien Tay", nameVi: "Bến xe Miền Tây", address: "Binh Tan", coordinates: [106.6155, 10.7422], isUnderground: false, status: 'planned' },
            { name: "Tan Kien", nameVi: "Tân Kiên", address: "Binh Chanh", coordinates: [106.5855, 10.7222], isUnderground: false, isDepot: true, status: 'planned' }
        ];

        const stationsLine4 = [
            { name: "Thanh Xuan", nameVi: "Thạnh Xuân", address: "District 12", coordinates: [106.6755, 10.8655], isUnderground: false, isDepot: true, status: 'planned' },
            { name: "Hanh Thong Tay", nameVi: "Hạnh Thông Tây", address: "Go Vap", coordinates: [106.6688, 10.8355], isUnderground: true, status: 'planned' },
            { name: "Go Vap Park", nameVi: "Công viên Gia Định", address: "Phu Nhuan", coordinates: [106.6755, 10.8055], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Phu Nhuan", nameVi: "Phú Nhuận", address: "Phu Nhuan", coordinates: [106.6812, 10.7955], isUnderground: true, status: 'planned' },
            { name: "Hai Ba Trung", nameVi: "Hai Bà Trưng", address: "District 1/3", coordinates: [106.6912, 10.7855], isUnderground: true, status: 'planned' },
            { name: "Hoang Dieu", nameVi: "Hoàng Diệu", address: "District 4", coordinates: [106.7012, 10.7622], isUnderground: true, status: 'planned' },
            { name: "Nguyen Van Linh", nameVi: "Nguyễn Văn Linh", address: "District 7", coordinates: [106.7155, 10.7455], isUnderground: false, status: 'planned' },
            { name: "Hiep Phuoc", nameVi: "Hiệp Phước", address: "Nha Be", coordinates: [106.7455, 10.6555], isUnderground: false, isDepot: true, status: 'planned' }
        ];

        const stationsLine5 = [
            { name: "Saigon Bridge", nameVi: "Cầu Sài Gòn", address: "Binh Thanh", coordinates: [106.7255, 10.7999], isUnderground: true, isInterchange: true, status: 'planned' },
            { name: "Hang Xanh", nameVi: "Hàng Xanh", address: "Binh Thanh", coordinates: [106.7122, 10.8022], isUnderground: true, status: 'planned' },
            { name: "Dam Sen", nameVi: "Đầm Sen", address: "District 11", coordinates: [106.6455, 10.7688], isUnderground: true, status: 'planned' },
            { name: "Can Giuoc", nameVi: "Bến xe Cần Giuộc", address: "District 8", coordinates: [106.6255, 10.7255], isUnderground: false, isDepot: true, status: 'planned' }
        ];

        const createdStations = {
            line1: [],
            line2: [],
            line3a: [],
            line4: [],
            line5: []
        };

        async function createStationsForLine(stationList, key) {
            const savedStations = [];
            for (const s of stationList) {
                let station = await Station.findOne({ name: s.name });
                if (!station) {
                    station = await Station.create({ ...s, hasWifi: true });
                } else {
                    if (!station.isInterchange) {
                        station.isInterchange = true;
                        await station.save();
                    }
                }
                savedStations.push(station);
            }
            createdStations[key] = savedStations;
            log(`Processed ${stationList.length} stations for ${key}`);
        }

        await createStationsForLine(stationsLine1, 'line1');
        await createStationsForLine(stationsLine2, 'line2');
        await createStationsForLine(stationsLine3A, 'line3a');
        await createStationsForLine(stationsLine4, 'line4');
        await createStationsForLine(stationsLine5, 'line5');

        // ==========================================
        // 2. METRO LINES
        // ==========================================

        const linesData = [
            {
                name: "Tuyến số 1: Bến Thành - Suối Tiên",
                color: "#ff3b30",
                status: 'operational',
                openingDate: "2024-07-01",
                length: 19.7,
                stations: createdStations.line1.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "5 phút", offPeakHours: "10 phút" },
                operatingHours: { weekday: "05:00 - 22:00", weekend: "05:00 - 23:00" }
            },
            {
                name: "Tuyến số 2: Bến Thành - Tham Lương",
                color: "#ffcc00",
                status: 'construction',
                openingDate: "2030-01-01",
                length: 11.0,
                stations: [createdStations.line1[0], ...createdStations.line2].map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "Chưa xác định", offPeakHours: "Chưa xác định" }
            },
            {
                name: "Tuyến số 3A: Bến Thành - Tân Kiên",
                color: "#007aff",
                status: 'planned',
                openingDate: "TBD",
                length: 19.8,
                stations: [createdStations.line1[0], ...createdStations.line3a].map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Tuyến số 4: Thạnh Xuân - Hiệp Phước",
                color: "#34c759",
                status: 'planned',
                openingDate: "TBD",
                length: 36.2,
                stations: createdStations.line4.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            },
            {
                name: "Tuyến số 5: Cầu Sài Gòn - Cần Giuộc",
                color: "#af52de",
                status: 'planned',
                openingDate: "TBD",
                length: 23.4,
                stations: createdStations.line5.map((s, i) => ({ station: s._id, order: i + 1 })),
                frequency: { peakHours: "TBD", offPeakHours: "TBD" }
            }
        ];

        const createdLines = await MetroLine.insertMany(linesData);
        log(`Created ${createdLines.length} Metro Lines.`);

        // ==========================================
        // 3. OTHER ENTITIES
        // ==========================================

        const ticketsData = [
            { category: 'luot', sub_type: 'thuong', name: 'Vé Lượt (Tiêu chuẩn)', price: 12000, description: 'Vé một chiều, có giá trị trong ngày.', status: 'active' },
            { category: 'ngay', sub_type: 'thuong', name: 'Vé 1 Ngày', price: 40000, description: 'Đi lại không giới hạn trong ngày đăng ký.', status: 'active', trip_limit: 999 },
            { category: 'thang', sub_type: 'thuong', name: 'Vé Tháng', price: 260000, description: 'Đi lại thoải mái trong 30 ngày.', status: 'active' },
            { category: 'nhom', sub_type: 'thuong', name: 'Vé Nhóm (3+ người)', price: 10000, description: 'Giá vé ưu đãi cho nhóm đông người.', status: 'active' }
        ];
        await Ticket.insertMany(ticketsData);
        log("✅ Tickets created");

        const newsData = [
            { title: "Vận hành thử nghiệm toàn tuyến Metro số 1", summary: "Testing...", content: "Content...", category: "announcement", tags: ["line1"], image: "https://khpt.1cdn.vn/2025/03/09/metro1.jpeg" },
            { title: "Cập nhật tiến độ dự án", summary: "Update...", content: "Content...", category: "update", tags: ["line2"], image: "https://khpt.1cdn.vn/thumbs/900x600/2025/10/07/screen-shot-2025-10-07-at-10.35.19-am.png" }
        ];
        await News.insertMany(newsData);
        log("✅ News created");

        log("🎉 FULL SEEDING COMPLETED!");
        process.exit(0);

    } catch (error) {
        log("❌ Seeding failed: " + error);
        process.exit(1);
    }
};

seedData();
