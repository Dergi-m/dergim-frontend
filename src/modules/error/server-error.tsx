import { Section } from '@/modules/ui/section';
import { Heading } from '@/modules/typography/heading';
import { RichText } from '@/modules/typography/rich-text';

type ServerErrorProps = {
  notFound?: boolean;
  generalError?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function ServerError({ notFound, generalError }: ServerErrorProps) {
  const header = 'Unexpected Server Error';
  const richText = '';

  return (
    <Section
      as="article"
      className="py-8"
    >
      {header && (
        <Heading
          as="h1"
          size="h2"
          className="text-center"
        >
          {header}
        </Heading>
      )}
      {richText && <RichText text={richText} />}
    </Section>
  );
}
