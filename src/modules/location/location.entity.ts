import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number

  @Column('nvarchar')
  name: string

  @Column('nvarchar')
  inGameLocation: string

  @Column('nvarchar')
  server: string

  @Column('nvarchar')
  datacenter: string

  @Column('nvarchar', { nullable: true })
  owner: string | null

  @Column('nvarchar', { nullable: true })
  description: string | null

  @Column('nvarchar', { nullable: true })
  externalLink: string | null

  @Column('nvarchar', { nullable: true })
  tags: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  static create(
    {
      name,
      inGameLocation,
      owner,
      description,
      externalLink,
      tags,
      server,
      datacenter
    }: LocationParameters
  ): Location {
    const location = new Location();
    location.name = name;
    location.inGameLocation = inGameLocation;
    location.server = server;
    location.datacenter = datacenter;
    location.owner = owner?? null;
    location.description= description?? null;
    location.externalLink= externalLink?? null;
    location.tags= tags?? null;
    return location;
  }

  updateValues(
    {
      name,
      inGameLocation,
      owner,
      description,
      externalLink,
      tags,
      server,
      datacenter
    }: Partial<LocationParameters>,
  ): Location {
    this.name = name ?? this.name;
    this.inGameLocation = inGameLocation ?? this.inGameLocation;
    this.server = server ?? this.server;
    this.datacenter = datacenter ?? this.datacenter;
    this.owner = owner ?? this.owner;
    this.description= description ?? this.description;
    this.externalLink= externalLink ?? this.externalLink;
    this.tags= tags ?? this.tags;
    return this;
  }
}

export interface LocationParameters {
  readonly name: string;
  readonly inGameLocation: string;
  readonly server: string;
  readonly datacenter: string;
  readonly owner?: string;
  readonly description?: string;
  readonly externalLink?: string;
  readonly tags?: string;
}
