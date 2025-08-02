import { Issue, IssueFlag, IssueStatus, Category, User } from '../models/index.js';
import { Op } from 'sequelize';

// Create a new issue
export const createIssue = async (req, res) => {
    const { title, description, category_id, latitude, longitude, address, is_anonymous } = req.body;

    try {
        const issue = await Issue.create({
            title,
            description,
            category_id,
            reporter_id: req.user.id,
            latitude,
            longitude,
            address,
            is_anonymous: is_anonymous || false
        });

        res.status(201).json({ message: 'Issue created', issue });
    } catch (err) {
        console.error('Issue creation error:', err);
        res.status(500).json({ error: 'Failed to create issue' });
    }
};

// Get all issues (optionally filter by status or category)
export const getIssues = async (req, res) => {
    const { category_id, status_id } = req.query;

    try {
        const whereClause = { is_hidden: false };

        if (category_id) whereClause.category_id = category_id;
        if (status_id) whereClause.status_id = status_id;

        const issues = await Issue.findAll({
            where: whereClause,
            include: [
                { model: Category, attributes: ['name', 'color_code'] },
                { model: IssueStatus, attributes: ['name', 'color_code'] },
                { model: User, attributes: ['user_name'], as: 'reporter' }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ issues });
    } catch (err) {
        console.error('Get issues error:', err);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
};

// Get issue by ID
export const getIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findOne({
            where: { id, is_hidden: false },
            include: [
                { model: Category, attributes: ['name', 'color_code'] },
                { model: IssueStatus, attributes: ['name', 'color_code'] },
                { model: User, attributes: ['user_name'], as: 'reporter' }
            ]
        });

        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        res.json({ issue });
    } catch (err) {
        console.error('Get issue by ID error:', err);
        res.status(500).json({ error: 'Failed to fetch issue' });
    }
};

// Flag an issue (prevent duplicate flags)
export const flagIssue = async (req, res) => {
    const { id } = req.params;
    const { flag_reason, flag_description } = req.body;

    try {
        const existingFlag = await IssueFlag.findOne({
            where: { issue_id: id, flagger_id: req.user.id }
        });

        if (existingFlag) {
            return res.status(400).json({ error: 'Already flagged this issue' });
        }

        await IssueFlag.create({
            issue_id: id,
            flagger_id: req.user.id,
            flag_reason,
            flag_description
        });

        res.json({ message: 'Issue flagged successfully' });
    } catch (err) {
        console.error('Flag issue error:', err);
        res.status(500).json({ error: 'Failed to flag issue' });
    }
};

// Update issue status (admin/agent only)
export const updateIssueStatus = async (req, res) => {
    const { id } = req.params;
    const { new_status_id } = req.body;

    try {
        const issue = await Issue.findByPk(id);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        const old_status_id = issue.status_id;

        issue.status_id = new_status_id;
        if (new_status_id == 3) { // Resolved status ID
            issue.is_resolved = true;
            issue.resolved_at = new Date();
        }

        await issue.save();

        // Log status change manually if triggers not used
        // Create status log entry, send notification etc. (Optional now)

        res.json({ message: 'Issue status updated', issue });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
};
