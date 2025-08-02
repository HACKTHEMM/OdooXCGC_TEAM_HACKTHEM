import { IssueFlag } from '../models/index.js';

const preventDuplicateFlag = async (req, res, next) => {
    const userId = req.user.id;
    const { issue_id } = req.body;

    try {
        const existingFlag = await IssueFlag.findOne({
            where: { issue_id, flagger_id: userId }
        });

        if (existingFlag) {
            return res.status(400).json({ error: 'You have already flagged this issue' });
        }

        next();
    } catch (error) {
        console.error('Error checking duplicate flag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default preventDuplicateFlag;
