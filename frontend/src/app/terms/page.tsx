'use client';

import Link from 'next/link';
import Header from '../../components/header';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-midnight">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="card-modern p-8">
                    <h1 className="text-4xl font-bold gradient-text-primary mb-8">
                        Terms and Conditions
                    </h1>

                    <div className="space-y-8 text-pure-white">
                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                By accessing and using CivicTrack, you accept and agree to be bound by the terms and
                                provision of this agreement. If you do not agree to abide by the above, please do not
                                use this service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                2. Use License
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                Permission is granted to temporarily download one copy of CivicTrack's materials for
                                personal, non-commercial transitory viewing only. This is the grant of a license, not
                                a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 text-soft-gray space-y-2">
                                <li>modify or copy the materials</li>
                                <li>use the materials for any commercial purpose or for any public display</li>
                                <li>attempt to reverse engineer any software contained on the website</li>
                                <li>remove any copyright or other proprietary notations from the materials</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                3. User Account and Data
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                When you create an account with us, you must provide information that is accurate,
                                complete, and current at all times. You are responsible for safeguarding the password
                                and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                4. Issue Reporting
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                Users may report civic issues through our platform. By submitting reports, you grant
                                CivicTrack permission to share this information with relevant authorities and other
                                users. You are responsible for ensuring the accuracy of your reports and must not
                                submit false or malicious content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                5. Privacy and Data Protection
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                Your privacy is important to us. We collect and use your information in accordance
                                with our Privacy Policy. By using our service, you consent to the collection and
                                use of information as described in our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                6. Prohibited Uses
                            </h2>
                            <p className="text-soft-gray leading-relaxed mb-4">
                                You may not use our service:
                            </p>
                            <ul className="list-disc pl-6 text-soft-gray space-y-2">
                                <li>for any unlawful purpose or to solicit others to perform unlawful acts</li>
                                <li>to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                                <li>to infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                                <li>to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                                <li>to submit false or misleading information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                7. Disclaimer
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                The information on this website is provided on an "as is" basis. To the fullest extent
                                permitted by law, this Company excludes all representations, warranties, conditions and
                                terms whether express or implied.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                8. Limitations
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                In no event shall CivicTrack or its suppliers be liable for any damages (including,
                                without limitation, damages for loss of data or profit, or due to business interruption)
                                arising out of the use or inability to use the materials on CivicTrack's website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                9. Accuracy of Materials
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                The materials appearing on CivicTrack's website could include technical, typographical,
                                or photographic errors. CivicTrack does not warrant that any of the materials on its
                                website are accurate, complete, or current.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                10. Modifications
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                CivicTrack may revise these terms of service for its website at any time without notice.
                                By using this website, you are agreeing to be bound by the then current version of
                                these terms of service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-neon-green mb-4">
                                11. Contact Information
                            </h2>
                            <p className="text-soft-gray leading-relaxed">
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </p>
                            <div className="mt-4 p-4 glass-surface rounded-lg border border-glass-border">
                                <p className="text-pure-white">Email: support@civictrack.com</p>
                                <p className="text-pure-white">Address: [Your Company Address]</p>
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
