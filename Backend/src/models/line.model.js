import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['delay', 'closure', 'maintenance', 'info'], required: true },
  message: String,
  startDate: String,
  endDate: String,
  active: Boolean,
});

const metroLineSchema = new mongoose.Schema({
  name: String,
  color: String,
  stations: [{
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
    order: Number 
  }],
  operatingHours: {
    weekday: String,
    weekend: String
  },
  frequency: {
    peakHours: String,
    offPeakHours: String
  },
  status: {
    type: String,
    enum: ['operational', 'construction', 'planned', 'closed']
  },
  openingDate: String,
  length: Number,
  alerts: [alertSchema]
}, { timestamps: true });

const MetroLine = mongoose.models.MetroLine || mongoose.model('MetroLine', metroLineSchema);

export default MetroLine;
