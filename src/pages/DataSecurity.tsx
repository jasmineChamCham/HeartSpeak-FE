import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function DataSecurity() {
    return (
        <LegalPageLayout title="Data Security">
            <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-10 border-l-4 border-primary bg-primary/5 dark:bg-primary/10 p-6 rounded-r-lg">
                At Encantta, trust is not optional. It is foundational.
            </div>

            <p>
                We understand that conversations are deeply personal. That is why we designed our system with security and privacy at its core.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">1. Secure Processing</h2>
            <p>
                Encantta analyzes text securely using encrypted connections (HTTPS). All communication between your device and our servers is protected.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">2. Minimal Data Collection</h2>
            <p>
                We only collect the information necessary to provide our services. We do not access your private accounts or messages without your direct input.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">3. No Unnecessary Storage</h2>
            <p>
                Encantta does not permanently store your conversation content unless explicitly required for account functionality or improvement purposes.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">4. Encryption Standards</h2>
            <p>
                Sensitive data is encrypted in transit using industry-standard security protocols.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">5. Restricted Access</h2>
            <p>
                Access to system infrastructure is limited to authorized personnel only and protected by strict authentication measures.
            </p>

            <h2 className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white mt-10 mb-4">6. Continuous Monitoring</h2>
            <p>
                We regularly monitor and update our systems to prevent vulnerabilities and maintain security integrity.
            </p>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10">
                <p className="m-0">
                    If you have any questions regarding data protection, please contact us at: <a href="mailto:support@Encantta.click" className="font-medium">support@Encantta.click</a>
                </p>
            </div>
        </LegalPageLayout>
    );
}
