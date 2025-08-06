'use client';

import Link from 'next/link';
import Header from '../../components/header';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-midnight">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="card-modern p-8">
                    <h1 className="text-4xl font-bold gradient-text-primary mb-8">
                        Privacy Policy
                    </h1>

                    <div className="space-y-8 text-pure-white">
                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                1. Information We Collect
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                We collect information you provide directly to us, such as when you create an account,
                                report an issue, or contact us. This may include:
                            </p>
                            <ul className="list-disc pl-6 text-soft-gray space-y-2">
                                <li>Name and email address</li>
                                <li>Phone number (optional)</li>
                                <li>Location data when reporting issues</li>
                                <li>Photos and descriptions of reported issues</li>
                                <li>Usage data and analytics</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                2. How We Use Your Information
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 text-soft-gray space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process and respond to issue reports</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Communicate with you about products, services, and events</li>
                                <li>Monitor and analyze trends and usage</li>
                                <li>Detect, investigate, and prevent fraudulent activities</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                3. Information Sharing and Disclosure
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                We may share your information in the following situations:
                            </p>
                            <ul className="list-disc pl-6 text-soft-gray space-y-2">
                                <li><strong>Public Issue Reports:</strong> Issue reports may be visible to other users and relevant authorities</li>
                                <li><strong>Government Authorities:</strong> We may share reports with municipal or government officials</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Service Providers:</strong> With third-party vendors who help us operate our service</li>
                                <li><strong>Consent:</strong> With your explicit consent</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                4. Data Security
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                We take reasonable measures to help protect information about you from loss, theft,
                                misuse, unauthorized access, disclosure, alteration, and destruction. However, no
                                internet or electronic storage system is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                5. Location Data
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                When you report issues, we collect location data to accurately map and categorize
                                civic problems. This location data is essential for our service and may be shared
                                with relevant authorities to address reported issues.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                6. Data Retention
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                We retain your information for as long as your account is active or as needed to
                                provide you services. We will retain and use your information as necessary to
                                comply with legal obligations, resolve disputes, and enforce our agreements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                7. Your Rights and Choices
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                You have the following rights regarding your personal information:
                            </p>
                            <ul className="list-disc pl-6 text-soft-gray space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal information</li>
                                <li><strong>Update:</strong> Correct or update your account information</li>
                                <li><strong>Delete:</strong> Request deletion of your account and data</li>
                                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from promotional communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                8. Cookies and Tracking
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                We use cookies and similar tracking technologies to collect and use personal
                                information about you. This helps us provide and improve our service, understand
                                user preferences, and analyze usage patterns.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                9. Third-Party Services
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                Our service may contain links to third-party websites or services. We are not
                                responsible for the privacy practices of these third parties. We encourage you
                                to read their privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                10. Children's Privacy
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                Our service is not intended for children under 13 years of age. We do not knowingly
                                collect personal information from children under 13. If we become aware that we have
                                collected personal information from a child under 13, we will take steps to delete
                                such information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                11. Changes to This Policy
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                We may update this privacy policy from time to time. We will notify you of any
                                changes by posting the new privacy policy on this page and updating the "Last
                                updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                12. Contact Us
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="p-4 glass-surface rounded-lg border border-glass-border">
                                <p className="text-pure-white">Email: privacy@civictrack.com</p>
                                <p className="text-pure-white">Address: [Your Company Address]</p>
                                <p className="text-pure-white">Phone: [Your Phone Number]</p>
                            </div>
                        </section>

                        <section className="border-t border-glass-border pt-8">
                            <p className="text-sm text-soft-gray">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/signup"
                            className="btn-modern px-8 py-3 mr-4"
                        >
                            Back to Sign Up
                        </Link>
                        <Link
                            href="/"
                            className="glass-surface border border-neon-green text-neon-green px-8 py-3 rounded-xl hover:shadow-neon transition-all duration-300 font-medium"
                        >
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
