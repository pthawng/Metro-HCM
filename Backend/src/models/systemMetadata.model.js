import mongoose from 'mongoose';

/**
 * SystemMetadata Schema 
 * Used for global system state, versioning, and feature flags.
 * (Staff-level optimization: Versioned Caching)
 */
const SystemMetadataSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
  }
}, { timestamps: true });

const SystemMetadata = mongoose.models.SystemMetadata || mongoose.model('SystemMetadata', SystemMetadataSchema);

/**
 * Global Metadata Initialization 
 * Ensures graphVersion exists on startup.
 */
export const initMetadata = async () => {
    const version = await SystemMetadata.findOne({ key: 'graph_version' });
    if (!version) {
        await SystemMetadata.create({
            key: 'graph_version',
            value: 1,
            description: 'Global version for transit graph cache invalidation'
        });
    }
};

export default SystemMetadata;
