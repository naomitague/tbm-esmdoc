import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/markdown';

export async function GET() {
  try {
    const allContent = getAllContent();

    const items = allContent.map(content => {
      const meta = content.metadata as any;
      return {
        slug: meta.slug,
        title: meta.parameterName || meta.name || meta.title || meta.slug || '',
        type: content.type,
      };
    });

    // Extract variables from current page (this would need page context in real implementation)
    const variables: string[] = [];

    return NextResponse.json({ items, variables });
  } catch (error) {
    console.error('Error loading sidebar data:', error);
    return NextResponse.json({ items: [], variables: [] }, { status: 500 });
  }
}
