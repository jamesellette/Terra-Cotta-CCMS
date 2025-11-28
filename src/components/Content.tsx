import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Article, 
  Cube, 
  FolderOpen, 
  Tag, 
  Images, 
  GlobeHemisphereWest,
  FileDashed
} from '@phosphor-icons/react'
import { PagesManager } from '@/components/cms/PagesManager'
import { ContentFragments } from '@/components/cms/ContentFragments'
import { MediaLibrary } from '@/components/cms/MediaLibrary'
import { TaxonomyManager } from '@/components/cms/TaxonomyManager'
import { SitesManager } from '@/components/cms/SitesManager'
import { ContentModels } from '@/components/cms/ContentModels'

export function Content() {
  const [activeTab, setActiveTab] = useState('pages')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground mt-1">Manage pages, content fragments, media assets, and taxonomies</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-6 gap-2">
          <TabsTrigger value="pages" className="gap-2">
            <Article size={16} weight="duotone" />
            <span className="hidden sm:inline">Pages</span>
          </TabsTrigger>
          <TabsTrigger value="fragments" className="gap-2">
            <Cube size={16} weight="duotone" />
            <span className="hidden sm:inline">Fragments</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <FileDashed size={16} weight="duotone" />
            <span className="hidden sm:inline">Models</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Images size={16} weight="duotone" />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="taxonomy" className="gap-2">
            <Tag size={16} weight="duotone" />
            <span className="hidden sm:inline">Taxonomy</span>
          </TabsTrigger>
          <TabsTrigger value="sites" className="gap-2">
            <GlobeHemisphereWest size={16} weight="duotone" />
            <span className="hidden sm:inline">Sites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <PagesManager />
        </TabsContent>

        <TabsContent value="fragments" className="space-y-4">
          <ContentFragments />
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <ContentModels />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <MediaLibrary />
        </TabsContent>

        <TabsContent value="taxonomy" className="space-y-4">
          <TaxonomyManager />
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <SitesManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
