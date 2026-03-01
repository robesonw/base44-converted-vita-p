import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, Calendar, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils/createPageUrl';
import apiFetch from '@/lib/api';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // example of an API call to retrieve help articles
  const { data: articles, isLoading } = useQuery({ 
    queryKey: ['helpArticles', searchQuery],
    queryFn: () => apiFetch(`/help/articles?search=${searchQuery}`),
  });

  const categories = [
    // ...define the categories (unchanged)
  ];

  return (
    <div className="help-center">
      <input 
        className="search-input"
        placeholder="Search Help Center..."
        value={searchQuery}
        onValueChange={handleSearchChange}
      />
      <Accordion>
        {categories.map(category => (
          <AccordionItem key={category.id}>
            <AccordionTrigger>{category.title}</AccordionTrigger>
            <AccordionContent>
              {/* Render guides here */}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Tabs>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my-articles">My Articles</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? <div>Loading...</div> : articles?.map(article => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;