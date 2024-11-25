import AuditTrail from "../models/AuditTrail.js";


// Get Audit Trail Entries for Single Contact (Simplified)
export const getAudit = async (req, res) => {
    try {
      const auditTrailEntries = await AuditTrail.find();
  
      // Filter out the unchanged fields
      const filteredEntries = auditTrailEntries.map(entry => {
        const changes = {};
  
        for (const [key, value] of Object.entries(entry.changes)) {
          if (value.previous !== value.current) {
            changes[key] = value;
          }
        }
  
        return { ...entry._doc, changes };
      });
  
      res.json(filteredEntries);
    } catch (error) {
      console.error('Error fetching audit trail entries:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  export const getLastAudit = async (req, res) => {
    try {
      const lastAuditEntry = await AuditTrail.findOne().sort({ createdAt: -1 });
  
      if (!lastAuditEntry) {
        return res.status(404).json({ message: 'No audit entries found' });
      }
  
      res.json(lastAuditEntry);
    } catch (error) {
      console.error('Error fetching last audit entry:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

