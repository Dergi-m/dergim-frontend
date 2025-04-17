import { CheckCircle } from 'lucide-react';

import { Button } from '@/modules/ui/button';
import { Card, CardContent } from '@/modules/ui/card';
import { Heading } from '@/modules/typography/heading';
import { Text } from '@/modules/typography/text';

export default async function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <section className="mb-16 text-center">
        <Heading
          size="h1"
          as="h1"
          className="mb-4 text-4xl font-bold md:text-5xl"
        >
          Automate Your Journal Workflow
        </Heading>
        <Text className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
          From <b>writing</b> to <b>editing</b> to <b>presenting</b> Dergi-M streamlines your entire
          publishing process.
        </Text>
      </section>

      <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: 'Project-Based Workflow',
            description:
              'Manage your journals like agile projects. Boards, tasks, and stages—all in one place.',
          },
          {
            title: 'Powerful Document Editor',
            description:
              'Write, edit, and collaborate in real-time with our Google Docs-style editor.',
          },
          {
            title: 'Smart File Management',
            description:
              'Upload, preview, and organize your .doc and .pdf files easily and efficiently.',
          },
        ].map((feature, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <CheckCircle className="text-primary" />
                <Heading
                  size="h3"
                  as="h3"
                  className="text-lg font-semibold"
                >
                  {feature.title}
                </Heading>
              </div>
              <Text className="text-muted-foreground text-sm">{feature.description}</Text>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="text-center">
        <Heading
          size="h2"
          as="h2"
          className="mb-4 text-2xl font-bold md:text-3xl"
        >
          Ready to streamline your editorial process?
        </Heading>
        <Button
          size="lg"
          className="font-extrabold"
        >
          Get Started
        </Button>
      </section>
    </main>
  );
}
