import mongoose from 'mongoose';
import { TicketCategory, TicketSubType, TicketStatus } from '../shared/constants/enums.js';

const TicketSchema = new mongoose.Schema({
    category: { 
        type: String, 
        enum: Object.values(TicketCategory), 
        required: true 
    },
    sub_type: { 
        type: String, 
        enum: Object.values(TicketSubType), 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, 
    description: { 
        type: String 
    }, 
    price: { 
        type: Number, 
        required: true 
    }, 
    trip_limit: { 
        type: Number, 
        default: null 
    },
    discount_percent: { 
        type: Number, 
        default: 0 
    },
    restrictions: { 
        type: String, 
        default: null 
    }, 
    availableFrom: { 
        type: Date, 
        default: null 
    }, 
    availableUntil: { 
        type: Date, 
        default: null 
    }, 
    status: { 
        type: String, 
        enum: Object.values(TicketStatus), 
        default: TicketStatus.INACTIVE 
    }, 
}, { 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

TicketSchema.virtual('validityPeriod').get(function() {
    if (!this.availableFrom || !this.availableUntil) return null;
    const diffTime = Math.abs(this.availableUntil - this.availableFrom);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

export default Ticket;