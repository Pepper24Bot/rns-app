import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { api } from 'app/redux/baseSlice';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
};

export type AbiChanged = ResolverEvent & {
  __typename?: 'AbiChanged';
  /** The block number at which the event was emitted */
  blockNumber: Scalars['Int']['output'];
  /** The content type of the ABI change */
  contentType: Scalars['BigInt']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The transaction hash of the transaction in which the event was emitted */
  transactionID: Scalars['Bytes']['output'];
};

export type AbiChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AbiChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  contentType?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_gt?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_gte?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contentType_lt?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_lte?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_not?: InputMaybe<Scalars['BigInt']['input']>;
  contentType_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AbiChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum AbiChanged_OrderBy {
  BlockNumber = 'blockNumber',
  ContentType = 'contentType',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type Account = {
  __typename?: 'Account';
  /** The domains owned by the account */
  domains: Array<Domain>;
  /** The unique identifier for the account */
  id: Scalars['ID']['output'];
  /** The Registrations made by the account */
  registrations?: Maybe<Array<Registration>>;
  /** The WrappedDomains owned by the account */
  wrappedDomains?: Maybe<Array<WrappedDomain>>;
};


export type AccountDomainsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Domain_Filter>;
};


export type AccountRegistrationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Registration_Filter>;
};


export type AccountWrappedDomainsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDomain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WrappedDomain_Filter>;
};

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  domains_?: InputMaybe<Domain_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  registrations_?: InputMaybe<Registration_Filter>;
  wrappedDomains_?: InputMaybe<WrappedDomain_Filter>;
};

export enum Account_OrderBy {
  Domains = 'domains',
  Id = 'id',
  Registrations = 'registrations',
  WrappedDomains = 'wrappedDomains'
}

export type AddrChanged = ResolverEvent & {
  __typename?: 'AddrChanged';
  /** The new address associated with the resolver */
  addr: Account;
  /** The block number at which this event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Unique identifier for this event */
  id: Scalars['ID']['output'];
  /** The resolver associated with this event */
  resolver: Resolver;
  /** The transaction ID for the transaction in which this event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type AddrChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addr?: InputMaybe<Scalars['String']['input']>;
  addr_?: InputMaybe<Account_Filter>;
  addr_contains?: InputMaybe<Scalars['String']['input']>;
  addr_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_gt?: InputMaybe<Scalars['String']['input']>;
  addr_gte?: InputMaybe<Scalars['String']['input']>;
  addr_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_lt?: InputMaybe<Scalars['String']['input']>;
  addr_lte?: InputMaybe<Scalars['String']['input']>;
  addr_not?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<AddrChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AddrChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum AddrChanged_OrderBy {
  Addr = 'addr',
  AddrId = 'addr__id',
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type AuthorisationChanged = ResolverEvent & {
  __typename?: 'AuthorisationChanged';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Unique identifier for this event */
  id: Scalars['ID']['output'];
  /** Whether the authorisation was added or removed */
  isAuthorized: Scalars['Boolean']['output'];
  /** The owner of the authorisation */
  owner: Scalars['Bytes']['output'];
  /** The resolver associated with this event */
  resolver: Resolver;
  /** The target of the authorisation */
  target: Scalars['Bytes']['output'];
  /** The transaction hash associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type AuthorisationChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuthorisationChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isAuthorized?: InputMaybe<Scalars['Boolean']['input']>;
  isAuthorized_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isAuthorized_not?: InputMaybe<Scalars['Boolean']['input']>;
  isAuthorized_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AuthorisationChanged_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  target?: InputMaybe<Scalars['Bytes']['input']>;
  target_contains?: InputMaybe<Scalars['Bytes']['input']>;
  target_gt?: InputMaybe<Scalars['Bytes']['input']>;
  target_gte?: InputMaybe<Scalars['Bytes']['input']>;
  target_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  target_lt?: InputMaybe<Scalars['Bytes']['input']>;
  target_lte?: InputMaybe<Scalars['Bytes']['input']>;
  target_not?: InputMaybe<Scalars['Bytes']['input']>;
  target_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  target_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum AuthorisationChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  IsAuthorized = 'isAuthorized',
  Owner = 'owner',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  Target = 'target',
  TransactionId = 'transactionID'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type ContenthashChanged = ResolverEvent & {
  __typename?: 'ContenthashChanged';
  /** The block number where the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The new content hash for the domain */
  hash: Scalars['Bytes']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The ID of the transaction where the event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type ContenthashChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ContenthashChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  hash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  hash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  hash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ContenthashChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ContenthashChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Hash = 'hash',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type Domain = {
  __typename?: 'Domain';
  /** The time when the domain was created */
  createdAt: Scalars['BigInt']['output'];
  /** The events associated with the domain */
  events: Array<DomainEvent>;
  /** The expiry date for the domain, from either the registration, or the wrapped domain if PCC is burned */
  expiryDate?: Maybe<Scalars['BigInt']['output']>;
  /** The namehash of the name */
  id: Scalars['ID']['output'];
  /** Indicates whether the domain has been migrated to a new registrar */
  isMigrated: Scalars['Boolean']['output'];
  /** The human readable label name (imported from CSV), if known */
  labelName?: Maybe<Scalars['String']['output']>;
  /** keccak256(labelName) */
  labelhash?: Maybe<Scalars['Bytes']['output']>;
  /** The human readable name, if known. Unknown portions replaced with hash in square brackets (eg, foo.[1234].eth) */
  name?: Maybe<Scalars['String']['output']>;
  /** The account that owns the domain */
  owner: Account;
  /** The namehash (id) of the parent name */
  parent?: Maybe<Domain>;
  /** The account that owns the ERC721 NFT for the domain */
  registrant?: Maybe<Account>;
  /** The registration associated with the domain */
  registration?: Maybe<Registration>;
  /** Address logged from current resolver, if any */
  resolvedAddress?: Maybe<Account>;
  /** The resolver that controls the domain's settings */
  resolver?: Maybe<Resolver>;
  /** The number of subdomains */
  subdomainCount: Scalars['Int']['output'];
  /** Can count domains from length of array */
  subdomains: Array<Domain>;
  /** The time-to-live (TTL) value of the domain's records */
  ttl?: Maybe<Scalars['BigInt']['output']>;
  /** The wrapped domain associated with the domain */
  wrappedDomain?: Maybe<WrappedDomain>;
  /** The account that owns the wrapped domain */
  wrappedOwner?: Maybe<Account>;
};


export type DomainEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DomainEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DomainEvent_Filter>;
};


export type DomainSubdomainsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Domain_Filter>;
};

export type DomainEvent = {
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type DomainEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DomainEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DomainEvent_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum DomainEvent_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  TransactionId = 'transactionID'
}

export type Domain_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Domain_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  events_?: InputMaybe<DomainEvent_Filter>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isMigrated?: InputMaybe<Scalars['Boolean']['input']>;
  isMigrated_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isMigrated_not?: InputMaybe<Scalars['Boolean']['input']>;
  isMigrated_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  labelName?: InputMaybe<Scalars['String']['input']>;
  labelName_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_gt?: InputMaybe<Scalars['String']['input']>;
  labelName_gte?: InputMaybe<Scalars['String']['input']>;
  labelName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_lt?: InputMaybe<Scalars['String']['input']>;
  labelName_lte?: InputMaybe<Scalars['String']['input']>;
  labelName_not?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelhash?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  labelhash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_not?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  labelhash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Domain_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['String']['input']>;
  parent_?: InputMaybe<Domain_Filter>;
  parent_contains?: InputMaybe<Scalars['String']['input']>;
  parent_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_ends_with?: InputMaybe<Scalars['String']['input']>;
  parent_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_gt?: InputMaybe<Scalars['String']['input']>;
  parent_gte?: InputMaybe<Scalars['String']['input']>;
  parent_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parent_lt?: InputMaybe<Scalars['String']['input']>;
  parent_lte?: InputMaybe<Scalars['String']['input']>;
  parent_not?: InputMaybe<Scalars['String']['input']>;
  parent_not_contains?: InputMaybe<Scalars['String']['input']>;
  parent_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parent_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parent_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parent_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parent_starts_with?: InputMaybe<Scalars['String']['input']>;
  parent_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant?: InputMaybe<Scalars['String']['input']>;
  registrant_?: InputMaybe<Account_Filter>;
  registrant_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_gt?: InputMaybe<Scalars['String']['input']>;
  registrant_gte?: InputMaybe<Scalars['String']['input']>;
  registrant_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_lt?: InputMaybe<Scalars['String']['input']>;
  registrant_lte?: InputMaybe<Scalars['String']['input']>;
  registrant_not?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  resolvedAddress?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_?: InputMaybe<Account_Filter>;
  resolvedAddress_contains?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_gt?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_gte?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolvedAddress_lt?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_lte?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolvedAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolvedAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subdomainCount?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_gt?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_gte?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  subdomainCount_lt?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_lte?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_not?: InputMaybe<Scalars['Int']['input']>;
  subdomainCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  subdomains_?: InputMaybe<Domain_Filter>;
  ttl?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ttl_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  wrappedDomain_?: InputMaybe<WrappedDomain_Filter>;
  wrappedOwner?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_?: InputMaybe<Account_Filter>;
  wrappedOwner_contains?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_gt?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_gte?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrappedOwner_lt?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_lte?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  wrappedOwner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_starts_with?: InputMaybe<Scalars['String']['input']>;
  wrappedOwner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Domain_OrderBy {
  CreatedAt = 'createdAt',
  Events = 'events',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  IsMigrated = 'isMigrated',
  LabelName = 'labelName',
  Labelhash = 'labelhash',
  Name = 'name',
  Owner = 'owner',
  OwnerId = 'owner__id',
  Parent = 'parent',
  ParentCreatedAt = 'parent__createdAt',
  ParentExpiryDate = 'parent__expiryDate',
  ParentId = 'parent__id',
  ParentIsMigrated = 'parent__isMigrated',
  ParentLabelName = 'parent__labelName',
  ParentLabelhash = 'parent__labelhash',
  ParentName = 'parent__name',
  ParentSubdomainCount = 'parent__subdomainCount',
  ParentTtl = 'parent__ttl',
  Registrant = 'registrant',
  RegistrantId = 'registrant__id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  ResolvedAddress = 'resolvedAddress',
  ResolvedAddressId = 'resolvedAddress__id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  SubdomainCount = 'subdomainCount',
  Subdomains = 'subdomains',
  Ttl = 'ttl',
  WrappedDomain = 'wrappedDomain',
  WrappedDomainExpiryDate = 'wrappedDomain__expiryDate',
  WrappedDomainFuses = 'wrappedDomain__fuses',
  WrappedDomainId = 'wrappedDomain__id',
  WrappedDomainName = 'wrappedDomain__name',
  WrappedOwner = 'wrappedOwner',
  WrappedOwnerId = 'wrappedOwner__id'
}

export type ExpiryExtended = DomainEvent & {
  __typename?: 'ExpiryExtended';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The new expiry date associated with the domain after the extension event */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type ExpiryExtended_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ExpiryExtended_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ExpiryExtended_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ExpiryExtended_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  TransactionId = 'transactionID'
}

export type FusesSet = DomainEvent & {
  __typename?: 'FusesSet';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The number of fuses associated with the domain after the set event */
  fuses: Scalars['Int']['output'];
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type FusesSet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FusesSet_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fuses?: InputMaybe<Scalars['Int']['input']>;
  fuses_gt?: InputMaybe<Scalars['Int']['input']>;
  fuses_gte?: InputMaybe<Scalars['Int']['input']>;
  fuses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fuses_lt?: InputMaybe<Scalars['Int']['input']>;
  fuses_lte?: InputMaybe<Scalars['Int']['input']>;
  fuses_not?: InputMaybe<Scalars['Int']['input']>;
  fuses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FusesSet_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum FusesSet_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Fuses = 'fuses',
  Id = 'id',
  TransactionId = 'transactionID'
}

export type InterfaceChanged = ResolverEvent & {
  __typename?: 'InterfaceChanged';
  /** The block number in which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** The address of the contract that implements the interface */
  implementer: Scalars['Bytes']['output'];
  /** The ID of the EIP-1820 interface that was changed */
  interfaceID: Scalars['Bytes']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The transaction ID for the transaction in which the event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type InterfaceChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InterfaceChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  implementer?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  implementer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_not?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  implementer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interfaceID?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interfaceID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_not?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  interfaceID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<InterfaceChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum InterfaceChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Implementer = 'implementer',
  InterfaceId = 'interfaceID',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type MulticoinAddrChanged = ResolverEvent & {
  __typename?: 'MulticoinAddrChanged';
  /** The new address value for the given coin type */
  addr: Scalars['Bytes']['output'];
  /** Block number in which this event was emitted */
  blockNumber: Scalars['Int']['output'];
  /** The coin type of the changed address */
  coinType: Scalars['BigInt']['output'];
  /** Unique identifier for the event */
  id: Scalars['ID']['output'];
  /** Resolver associated with this event */
  resolver: Resolver;
  /** Transaction ID in which this event was emitted */
  transactionID: Scalars['Bytes']['output'];
};

export type MulticoinAddrChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addr?: InputMaybe<Scalars['Bytes']['input']>;
  addr_contains?: InputMaybe<Scalars['Bytes']['input']>;
  addr_gt?: InputMaybe<Scalars['Bytes']['input']>;
  addr_gte?: InputMaybe<Scalars['Bytes']['input']>;
  addr_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  addr_lt?: InputMaybe<Scalars['Bytes']['input']>;
  addr_lte?: InputMaybe<Scalars['Bytes']['input']>;
  addr_not?: InputMaybe<Scalars['Bytes']['input']>;
  addr_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  addr_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<MulticoinAddrChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  coinType?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_gt?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_gte?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinType_lt?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_lte?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_not?: InputMaybe<Scalars['BigInt']['input']>;
  coinType_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<MulticoinAddrChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum MulticoinAddrChanged_OrderBy {
  Addr = 'addr',
  BlockNumber = 'blockNumber',
  CoinType = 'coinType',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type NameChanged = ResolverEvent & {
  __typename?: 'NameChanged';
  /** Block number where event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** New ENS name value */
  name: Scalars['String']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** Unique transaction ID where event occurred */
  transactionID: Scalars['Bytes']['output'];
};

export type NameChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<NameChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Name = 'name',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type NameRegistered = RegistrationEvent & {
  __typename?: 'NameRegistered';
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The expiry date of the registration */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the NameRegistered event */
  id: Scalars['ID']['output'];
  /** The account that registered the name */
  registrant: Account;
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameRegistered_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameRegistered_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NameRegistered_Filter>>>;
  registrant?: InputMaybe<Scalars['String']['input']>;
  registrant_?: InputMaybe<Account_Filter>;
  registrant_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_gt?: InputMaybe<Scalars['String']['input']>;
  registrant_gte?: InputMaybe<Scalars['String']['input']>;
  registrant_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_lt?: InputMaybe<Scalars['String']['input']>;
  registrant_lte?: InputMaybe<Scalars['String']['input']>;
  registrant_not?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameRegistered_OrderBy {
  BlockNumber = 'blockNumber',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  Registrant = 'registrant',
  RegistrantId = 'registrant__id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type NameRenewed = RegistrationEvent & {
  __typename?: 'NameRenewed';
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The new expiry date of the registration */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the NameRenewed event */
  id: Scalars['ID']['output'];
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameRenewed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameRenewed_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NameRenewed_Filter>>>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameRenewed_OrderBy {
  BlockNumber = 'blockNumber',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type NameTransferred = RegistrationEvent & {
  __typename?: 'NameTransferred';
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The ID of the event */
  id: Scalars['ID']['output'];
  /** The new owner of the domain */
  newOwner: Account;
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID of the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameTransferred_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  newOwner?: InputMaybe<Scalars['String']['input']>;
  newOwner_?: InputMaybe<Account_Filter>;
  newOwner_contains?: InputMaybe<Scalars['String']['input']>;
  newOwner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_ends_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_gt?: InputMaybe<Scalars['String']['input']>;
  newOwner_gte?: InputMaybe<Scalars['String']['input']>;
  newOwner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_lt?: InputMaybe<Scalars['String']['input']>;
  newOwner_lte?: InputMaybe<Scalars['String']['input']>;
  newOwner_not?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_contains?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newOwner_starts_with?: InputMaybe<Scalars['String']['input']>;
  newOwner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<NameTransferred_Filter>>>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameTransferred_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  NewOwner = 'newOwner',
  NewOwnerId = 'newOwner__id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type NameUnwrapped = DomainEvent & {
  __typename?: 'NameUnwrapped';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The account that owns the domain after it was unwrapped */
  owner: Account;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NameUnwrapped_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameUnwrapped_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NameUnwrapped_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameUnwrapped_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type NameWrapped = DomainEvent & {
  __typename?: 'NameWrapped';
  /** The block number at which the wrapped domain was wrapped */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the wrapped domain */
  domain: Domain;
  /** The expiry date of the wrapped domain registration */
  expiryDate: Scalars['BigInt']['output'];
  /** The number of fuses associated with the wrapped domain */
  fuses: Scalars['Int']['output'];
  /** The unique identifier of the wrapped domain */
  id: Scalars['ID']['output'];
  /** The human-readable name of the wrapped domain */
  name?: Maybe<Scalars['String']['output']>;
  /** The account that owns the wrapped domain */
  owner: Account;
  /** The transaction hash of the transaction that wrapped the domain */
  transactionID: Scalars['Bytes']['output'];
};

export type NameWrapped_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NameWrapped_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fuses?: InputMaybe<Scalars['Int']['input']>;
  fuses_gt?: InputMaybe<Scalars['Int']['input']>;
  fuses_gte?: InputMaybe<Scalars['Int']['input']>;
  fuses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fuses_lt?: InputMaybe<Scalars['Int']['input']>;
  fuses_lte?: InputMaybe<Scalars['Int']['input']>;
  fuses_not?: InputMaybe<Scalars['Int']['input']>;
  fuses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<NameWrapped_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NameWrapped_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  ExpiryDate = 'expiryDate',
  Fuses = 'fuses',
  Id = 'id',
  Name = 'name',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type NewOwner = DomainEvent & {
  __typename?: 'NewOwner';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The new account that owns the domain */
  owner: Account;
  /** The parent domain of the domain name associated with the event */
  parentDomain: Domain;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NewOwner_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NewOwner_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NewOwner_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain?: InputMaybe<Scalars['String']['input']>;
  parentDomain_?: InputMaybe<Domain_Filter>;
  parentDomain_contains?: InputMaybe<Scalars['String']['input']>;
  parentDomain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_gt?: InputMaybe<Scalars['String']['input']>;
  parentDomain_gte?: InputMaybe<Scalars['String']['input']>;
  parentDomain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentDomain_lt?: InputMaybe<Scalars['String']['input']>;
  parentDomain_lte?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentDomain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentDomain_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentDomain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NewOwner_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  ParentDomain = 'parentDomain',
  ParentDomainCreatedAt = 'parentDomain__createdAt',
  ParentDomainExpiryDate = 'parentDomain__expiryDate',
  ParentDomainId = 'parentDomain__id',
  ParentDomainIsMigrated = 'parentDomain__isMigrated',
  ParentDomainLabelName = 'parentDomain__labelName',
  ParentDomainLabelhash = 'parentDomain__labelhash',
  ParentDomainName = 'parentDomain__name',
  ParentDomainSubdomainCount = 'parentDomain__subdomainCount',
  ParentDomainTtl = 'parentDomain__ttl',
  TransactionId = 'transactionID'
}

export type NewResolver = DomainEvent & {
  __typename?: 'NewResolver';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The new resolver contract address associated with the domain */
  resolver: Resolver;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type NewResolver_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NewResolver_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NewResolver_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum NewResolver_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type NewTtl = DomainEvent & {
  __typename?: 'NewTTL';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
  /** The new TTL value (in seconds) associated with the domain */
  ttl: Scalars['BigInt']['output'];
};

export type NewTtl_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NewTtl_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NewTtl_Filter>>>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ttl?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_gte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ttl_lt?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_lte?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not?: InputMaybe<Scalars['BigInt']['input']>;
  ttl_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum NewTtl_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  TransactionId = 'transactionID',
  Ttl = 'ttl'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PubkeyChanged = ResolverEvent & {
  __typename?: 'PubkeyChanged';
  /** Block number of the Ethereum block where the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** Transaction hash of the Ethereum transaction where the event occurred */
  transactionID: Scalars['Bytes']['output'];
  /** The x-coordinate of the new public key */
  x: Scalars['Bytes']['output'];
  /** The y-coordinate of the new public key */
  y: Scalars['Bytes']['output'];
};

export type PubkeyChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PubkeyChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PubkeyChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  x?: InputMaybe<Scalars['Bytes']['input']>;
  x_contains?: InputMaybe<Scalars['Bytes']['input']>;
  x_gt?: InputMaybe<Scalars['Bytes']['input']>;
  x_gte?: InputMaybe<Scalars['Bytes']['input']>;
  x_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  x_lt?: InputMaybe<Scalars['Bytes']['input']>;
  x_lte?: InputMaybe<Scalars['Bytes']['input']>;
  x_not?: InputMaybe<Scalars['Bytes']['input']>;
  x_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  x_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  y?: InputMaybe<Scalars['Bytes']['input']>;
  y_contains?: InputMaybe<Scalars['Bytes']['input']>;
  y_gt?: InputMaybe<Scalars['Bytes']['input']>;
  y_gte?: InputMaybe<Scalars['Bytes']['input']>;
  y_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  y_lt?: InputMaybe<Scalars['Bytes']['input']>;
  y_lte?: InputMaybe<Scalars['Bytes']['input']>;
  y_not?: InputMaybe<Scalars['Bytes']['input']>;
  y_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  y_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum PubkeyChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID',
  X = 'x',
  Y = 'y'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  abiChanged?: Maybe<AbiChanged>;
  abiChangeds: Array<AbiChanged>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  addrChanged?: Maybe<AddrChanged>;
  addrChangeds: Array<AddrChanged>;
  authorisationChanged?: Maybe<AuthorisationChanged>;
  authorisationChangeds: Array<AuthorisationChanged>;
  contenthashChanged?: Maybe<ContenthashChanged>;
  contenthashChangeds: Array<ContenthashChanged>;
  domain?: Maybe<Domain>;
  domainEvent?: Maybe<DomainEvent>;
  domainEvents: Array<DomainEvent>;
  domains: Array<Domain>;
  expiryExtended?: Maybe<ExpiryExtended>;
  expiryExtendeds: Array<ExpiryExtended>;
  fusesSet?: Maybe<FusesSet>;
  fusesSets: Array<FusesSet>;
  interfaceChanged?: Maybe<InterfaceChanged>;
  interfaceChangeds: Array<InterfaceChanged>;
  multicoinAddrChanged?: Maybe<MulticoinAddrChanged>;
  multicoinAddrChangeds: Array<MulticoinAddrChanged>;
  nameChanged?: Maybe<NameChanged>;
  nameChangeds: Array<NameChanged>;
  nameRegistered?: Maybe<NameRegistered>;
  nameRegistereds: Array<NameRegistered>;
  nameRenewed?: Maybe<NameRenewed>;
  nameReneweds: Array<NameRenewed>;
  nameTransferred?: Maybe<NameTransferred>;
  nameTransferreds: Array<NameTransferred>;
  nameUnwrapped?: Maybe<NameUnwrapped>;
  nameUnwrappeds: Array<NameUnwrapped>;
  nameWrapped?: Maybe<NameWrapped>;
  nameWrappeds: Array<NameWrapped>;
  newOwner?: Maybe<NewOwner>;
  newOwners: Array<NewOwner>;
  newResolver?: Maybe<NewResolver>;
  newResolvers: Array<NewResolver>;
  newTTL?: Maybe<NewTtl>;
  newTTLs: Array<NewTtl>;
  pubkeyChanged?: Maybe<PubkeyChanged>;
  pubkeyChangeds: Array<PubkeyChanged>;
  registration?: Maybe<Registration>;
  registrationEvent?: Maybe<RegistrationEvent>;
  registrationEvents: Array<RegistrationEvent>;
  registrations: Array<Registration>;
  resolver?: Maybe<Resolver>;
  resolverEvent?: Maybe<ResolverEvent>;
  resolverEvents: Array<ResolverEvent>;
  resolvers: Array<Resolver>;
  textChanged?: Maybe<TextChanged>;
  textChangeds: Array<TextChanged>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  versionChanged?: Maybe<VersionChanged>;
  versionChangeds: Array<VersionChanged>;
  wrappedDomain?: Maybe<WrappedDomain>;
  wrappedDomains: Array<WrappedDomain>;
  wrappedTransfer?: Maybe<WrappedTransfer>;
  wrappedTransfers: Array<WrappedTransfer>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAbiChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAbiChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AbiChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AbiChanged_Filter>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddrChanged_Filter>;
};


export type QueryAuthorisationChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAuthorisationChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuthorisationChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuthorisationChanged_Filter>;
};


export type QueryContenthashChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContenthashChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ContenthashChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContenthashChanged_Filter>;
};


export type QueryDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDomainEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDomainEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DomainEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DomainEvent_Filter>;
};


export type QueryDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Domain_Filter>;
};


export type QueryExpiryExtendedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryExpiryExtendedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ExpiryExtended_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExpiryExtended_Filter>;
};


export type QueryFusesSetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFusesSetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FusesSet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FusesSet_Filter>;
};


export type QueryInterfaceChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInterfaceChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterfaceChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterfaceChanged_Filter>;
};


export type QueryMulticoinAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMulticoinAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MulticoinAddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MulticoinAddrChanged_Filter>;
};


export type QueryNameChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameChanged_Filter>;
};


export type QueryNameRegisteredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameRegisteredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRegistered_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRegistered_Filter>;
};


export type QueryNameRenewedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameRenewedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRenewed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRenewed_Filter>;
};


export type QueryNameTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameTransferred_Filter>;
};


export type QueryNameUnwrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameUnwrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameUnwrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameUnwrapped_Filter>;
};


export type QueryNameWrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNameWrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameWrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameWrapped_Filter>;
};


export type QueryNewOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNewOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewOwner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewOwner_Filter>;
};


export type QueryNewResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNewResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewResolver_Filter>;
};


export type QueryNewTtlArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNewTtLsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewTtl_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewTtl_Filter>;
};


export type QueryPubkeyChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPubkeyChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PubkeyChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PubkeyChanged_Filter>;
};


export type QueryRegistrationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegistrationEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRegistrationEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistrationEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegistrationEvent_Filter>;
};


export type QueryRegistrationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registration_Filter>;
};


export type QueryResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryResolverEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryResolverEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ResolverEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolverEvent_Filter>;
};


export type QueryResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Resolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Resolver_Filter>;
};


export type QueryTextChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTextChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TextChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TextChanged_Filter>;
};


export type QueryTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type QueryVersionChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVersionChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VersionChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VersionChanged_Filter>;
};


export type QueryWrappedDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWrappedDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDomain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedDomain_Filter>;
};


export type QueryWrappedTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWrappedTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedTransfer_Filter>;
};

export type Registration = {
  __typename?: 'Registration';
  /** The cost associated with the domain registration */
  cost?: Maybe<Scalars['BigInt']['output']>;
  /** The domain name associated with the registration */
  domain: Domain;
  /** The events associated with the domain registration */
  events: Array<RegistrationEvent>;
  /** The expiry date of the domain */
  expiryDate: Scalars['BigInt']['output'];
  /** The unique identifier of the registration */
  id: Scalars['ID']['output'];
  /** The human-readable label name associated with the domain registration */
  labelName?: Maybe<Scalars['String']['output']>;
  /** The account that registered the domain */
  registrant: Account;
  /** The registration date of the domain */
  registrationDate: Scalars['BigInt']['output'];
};


export type RegistrationEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistrationEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RegistrationEvent_Filter>;
};

export type RegistrationEvent = {
  /** The block number of the event */
  blockNumber: Scalars['Int']['output'];
  /** The unique identifier of the registration event */
  id: Scalars['ID']['output'];
  /** The registration associated with the event */
  registration: Registration;
  /** The transaction ID associated with the event */
  transactionID: Scalars['Bytes']['output'];
};

export type RegistrationEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RegistrationEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RegistrationEvent_Filter>>>;
  registration?: InputMaybe<Scalars['String']['input']>;
  registration_?: InputMaybe<Registration_Filter>;
  registration_contains?: InputMaybe<Scalars['String']['input']>;
  registration_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_gt?: InputMaybe<Scalars['String']['input']>;
  registration_gte?: InputMaybe<Scalars['String']['input']>;
  registration_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_lt?: InputMaybe<Scalars['String']['input']>;
  registration_lte?: InputMaybe<Scalars['String']['input']>;
  registration_not?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains?: InputMaybe<Scalars['String']['input']>;
  registration_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registration_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with?: InputMaybe<Scalars['String']['input']>;
  registration_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum RegistrationEvent_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Registration = 'registration',
  RegistrationCost = 'registration__cost',
  RegistrationExpiryDate = 'registration__expiryDate',
  RegistrationId = 'registration__id',
  RegistrationLabelName = 'registration__labelName',
  RegistrationRegistrationDate = 'registration__registrationDate',
  TransactionId = 'transactionID'
}

export type Registration_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Registration_Filter>>>;
  cost?: InputMaybe<Scalars['BigInt']['input']>;
  cost_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cost_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cost_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cost_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cost_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cost_not?: InputMaybe<Scalars['BigInt']['input']>;
  cost_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  events_?: InputMaybe<RegistrationEvent_Filter>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  labelName?: InputMaybe<Scalars['String']['input']>;
  labelName_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_gt?: InputMaybe<Scalars['String']['input']>;
  labelName_gte?: InputMaybe<Scalars['String']['input']>;
  labelName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_lt?: InputMaybe<Scalars['String']['input']>;
  labelName_lte?: InputMaybe<Scalars['String']['input']>;
  labelName_not?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains?: InputMaybe<Scalars['String']['input']>;
  labelName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  labelName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with?: InputMaybe<Scalars['String']['input']>;
  labelName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Registration_Filter>>>;
  registrant?: InputMaybe<Scalars['String']['input']>;
  registrant_?: InputMaybe<Account_Filter>;
  registrant_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_gt?: InputMaybe<Scalars['String']['input']>;
  registrant_gte?: InputMaybe<Scalars['String']['input']>;
  registrant_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_lt?: InputMaybe<Scalars['String']['input']>;
  registrant_lte?: InputMaybe<Scalars['String']['input']>;
  registrant_not?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains?: InputMaybe<Scalars['String']['input']>;
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  registrant_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with?: InputMaybe<Scalars['String']['input']>;
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  registrationDate?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  registrationDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  registrationDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Registration_OrderBy {
  Cost = 'cost',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Events = 'events',
  ExpiryDate = 'expiryDate',
  Id = 'id',
  LabelName = 'labelName',
  Registrant = 'registrant',
  RegistrantId = 'registrant__id',
  RegistrationDate = 'registrationDate'
}

export type Resolver = {
  __typename?: 'Resolver';
  /** The current value of the 'addr' record for this resolver, as determined by the associated events */
  addr?: Maybe<Account>;
  /** The address of the resolver contract */
  address: Scalars['Bytes']['output'];
  /** The set of observed SLIP-44 coin types for this resolver */
  coinTypes?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** The content hash for this resolver, in binary format */
  contentHash?: Maybe<Scalars['Bytes']['output']>;
  /** The domain that this resolver is associated with */
  domain?: Maybe<Domain>;
  /** The events associated with this resolver */
  events: Array<ResolverEvent>;
  /** The unique identifier for this resolver, which is a concatenation of the resolver address and the domain namehash */
  id: Scalars['ID']['output'];
  /** The set of observed text record keys for this resolver */
  texts?: Maybe<Array<Scalars['String']['output']>>;
};


export type ResolverEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ResolverEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ResolverEvent_Filter>;
};

export type ResolverEvent = {
  /** The block number that the event occurred on */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** The transaction hash of the event */
  transactionID: Scalars['Bytes']['output'];
};

export type ResolverEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ResolverEvent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ResolverEvent_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum ResolverEvent_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID'
}

export type Resolver_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addr?: InputMaybe<Scalars['String']['input']>;
  addr_?: InputMaybe<Account_Filter>;
  addr_contains?: InputMaybe<Scalars['String']['input']>;
  addr_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_gt?: InputMaybe<Scalars['String']['input']>;
  addr_gte?: InputMaybe<Scalars['String']['input']>;
  addr_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_lt?: InputMaybe<Scalars['String']['input']>;
  addr_lte?: InputMaybe<Scalars['String']['input']>;
  addr_not?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains?: InputMaybe<Scalars['String']['input']>;
  addr_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  addr_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with?: InputMaybe<Scalars['String']['input']>;
  addr_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Resolver_Filter>>>;
  coinTypes?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coinTypes_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  contentHash?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  contentHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  contentHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  events_?: InputMaybe<ResolverEvent_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Resolver_Filter>>>;
  texts?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_not?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  texts_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum Resolver_OrderBy {
  Addr = 'addr',
  AddrId = 'addr__id',
  Address = 'address',
  CoinTypes = 'coinTypes',
  ContentHash = 'contentHash',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Events = 'events',
  Id = 'id',
  Texts = 'texts'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  abiChanged?: Maybe<AbiChanged>;
  abiChangeds: Array<AbiChanged>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  addrChanged?: Maybe<AddrChanged>;
  addrChangeds: Array<AddrChanged>;
  authorisationChanged?: Maybe<AuthorisationChanged>;
  authorisationChangeds: Array<AuthorisationChanged>;
  contenthashChanged?: Maybe<ContenthashChanged>;
  contenthashChangeds: Array<ContenthashChanged>;
  domain?: Maybe<Domain>;
  domainEvent?: Maybe<DomainEvent>;
  domainEvents: Array<DomainEvent>;
  domains: Array<Domain>;
  expiryExtended?: Maybe<ExpiryExtended>;
  expiryExtendeds: Array<ExpiryExtended>;
  fusesSet?: Maybe<FusesSet>;
  fusesSets: Array<FusesSet>;
  interfaceChanged?: Maybe<InterfaceChanged>;
  interfaceChangeds: Array<InterfaceChanged>;
  multicoinAddrChanged?: Maybe<MulticoinAddrChanged>;
  multicoinAddrChangeds: Array<MulticoinAddrChanged>;
  nameChanged?: Maybe<NameChanged>;
  nameChangeds: Array<NameChanged>;
  nameRegistered?: Maybe<NameRegistered>;
  nameRegistereds: Array<NameRegistered>;
  nameRenewed?: Maybe<NameRenewed>;
  nameReneweds: Array<NameRenewed>;
  nameTransferred?: Maybe<NameTransferred>;
  nameTransferreds: Array<NameTransferred>;
  nameUnwrapped?: Maybe<NameUnwrapped>;
  nameUnwrappeds: Array<NameUnwrapped>;
  nameWrapped?: Maybe<NameWrapped>;
  nameWrappeds: Array<NameWrapped>;
  newOwner?: Maybe<NewOwner>;
  newOwners: Array<NewOwner>;
  newResolver?: Maybe<NewResolver>;
  newResolvers: Array<NewResolver>;
  newTTL?: Maybe<NewTtl>;
  newTTLs: Array<NewTtl>;
  pubkeyChanged?: Maybe<PubkeyChanged>;
  pubkeyChangeds: Array<PubkeyChanged>;
  registration?: Maybe<Registration>;
  registrationEvent?: Maybe<RegistrationEvent>;
  registrationEvents: Array<RegistrationEvent>;
  registrations: Array<Registration>;
  resolver?: Maybe<Resolver>;
  resolverEvent?: Maybe<ResolverEvent>;
  resolverEvents: Array<ResolverEvent>;
  resolvers: Array<Resolver>;
  textChanged?: Maybe<TextChanged>;
  textChangeds: Array<TextChanged>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  versionChanged?: Maybe<VersionChanged>;
  versionChangeds: Array<VersionChanged>;
  wrappedDomain?: Maybe<WrappedDomain>;
  wrappedDomains: Array<WrappedDomain>;
  wrappedTransfer?: Maybe<WrappedTransfer>;
  wrappedTransfers: Array<WrappedTransfer>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAbiChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAbiChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AbiChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AbiChanged_Filter>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type SubscriptionAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddrChanged_Filter>;
};


export type SubscriptionAuthorisationChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAuthorisationChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuthorisationChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuthorisationChanged_Filter>;
};


export type SubscriptionContenthashChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContenthashChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ContenthashChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContenthashChanged_Filter>;
};


export type SubscriptionDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDomainEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDomainEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DomainEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DomainEvent_Filter>;
};


export type SubscriptionDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Domain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Domain_Filter>;
};


export type SubscriptionExpiryExtendedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionExpiryExtendedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ExpiryExtended_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ExpiryExtended_Filter>;
};


export type SubscriptionFusesSetArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFusesSetsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FusesSet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FusesSet_Filter>;
};


export type SubscriptionInterfaceChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionInterfaceChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterfaceChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterfaceChanged_Filter>;
};


export type SubscriptionMulticoinAddrChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMulticoinAddrChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<MulticoinAddrChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MulticoinAddrChanged_Filter>;
};


export type SubscriptionNameChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameChanged_Filter>;
};


export type SubscriptionNameRegisteredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameRegisteredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRegistered_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRegistered_Filter>;
};


export type SubscriptionNameRenewedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameRenewedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameRenewed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameRenewed_Filter>;
};


export type SubscriptionNameTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameTransferred_Filter>;
};


export type SubscriptionNameUnwrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameUnwrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameUnwrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameUnwrapped_Filter>;
};


export type SubscriptionNameWrappedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNameWrappedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NameWrapped_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NameWrapped_Filter>;
};


export type SubscriptionNewOwnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNewOwnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewOwner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewOwner_Filter>;
};


export type SubscriptionNewResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNewResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewResolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewResolver_Filter>;
};


export type SubscriptionNewTtlArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNewTtLsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NewTtl_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewTtl_Filter>;
};


export type SubscriptionPubkeyChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPubkeyChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PubkeyChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PubkeyChanged_Filter>;
};


export type SubscriptionRegistrationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRegistrationEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRegistrationEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistrationEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RegistrationEvent_Filter>;
};


export type SubscriptionRegistrationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Registration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Registration_Filter>;
};


export type SubscriptionResolverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionResolverEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionResolverEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ResolverEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolverEvent_Filter>;
};


export type SubscriptionResolversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Resolver_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Resolver_Filter>;
};


export type SubscriptionTextChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTextChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TextChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TextChanged_Filter>;
};


export type SubscriptionTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type SubscriptionVersionChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVersionChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VersionChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VersionChanged_Filter>;
};


export type SubscriptionWrappedDomainArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWrappedDomainsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedDomain_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedDomain_Filter>;
};


export type SubscriptionWrappedTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWrappedTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WrappedTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WrappedTransfer_Filter>;
};

export type TextChanged = ResolverEvent & {
  __typename?: 'TextChanged';
  /** Block number of the Ethereum block in which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Concatenation of block number and log ID */
  id: Scalars['ID']['output'];
  /** The key of the text record that was changed */
  key: Scalars['String']['output'];
  /** Used to derive relationships to Resolvers */
  resolver: Resolver;
  /** Hash of the Ethereum transaction in which the event occurred */
  transactionID: Scalars['Bytes']['output'];
  /** The new value of the text record that was changed */
  value?: Maybe<Scalars['String']['output']>;
};

export type TextChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TextChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  key?: InputMaybe<Scalars['String']['input']>;
  key_contains?: InputMaybe<Scalars['String']['input']>;
  key_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  key_ends_with?: InputMaybe<Scalars['String']['input']>;
  key_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_gt?: InputMaybe<Scalars['String']['input']>;
  key_gte?: InputMaybe<Scalars['String']['input']>;
  key_in?: InputMaybe<Array<Scalars['String']['input']>>;
  key_lt?: InputMaybe<Scalars['String']['input']>;
  key_lte?: InputMaybe<Scalars['String']['input']>;
  key_not?: InputMaybe<Scalars['String']['input']>;
  key_not_contains?: InputMaybe<Scalars['String']['input']>;
  key_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  key_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  key_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  key_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  key_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  key_starts_with?: InputMaybe<Scalars['String']['input']>;
  key_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<TextChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  value?: InputMaybe<Scalars['String']['input']>;
  value_contains?: InputMaybe<Scalars['String']['input']>;
  value_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  value_ends_with?: InputMaybe<Scalars['String']['input']>;
  value_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_gt?: InputMaybe<Scalars['String']['input']>;
  value_gte?: InputMaybe<Scalars['String']['input']>;
  value_in?: InputMaybe<Array<Scalars['String']['input']>>;
  value_lt?: InputMaybe<Scalars['String']['input']>;
  value_lte?: InputMaybe<Scalars['String']['input']>;
  value_not?: InputMaybe<Scalars['String']['input']>;
  value_not_contains?: InputMaybe<Scalars['String']['input']>;
  value_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  value_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  value_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  value_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  value_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_starts_with?: InputMaybe<Scalars['String']['input']>;
  value_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TextChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Key = 'key',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID',
  Value = 'value'
}

export type Transfer = DomainEvent & {
  __typename?: 'Transfer';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The account that owns the domain after the transfer */
  owner: Account;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type Transfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Transfer_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type VersionChanged = ResolverEvent & {
  __typename?: 'VersionChanged';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** Unique identifier for this event */
  id: Scalars['ID']['output'];
  /** The resolver associated with this event */
  resolver: Resolver;
  /** The transaction hash associated with the event */
  transactionID: Scalars['Bytes']['output'];
  /** The new version number of the resolver */
  version: Scalars['BigInt']['output'];
};

export type VersionChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VersionChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VersionChanged_Filter>>>;
  resolver?: InputMaybe<Scalars['String']['input']>;
  resolver_?: InputMaybe<Resolver_Filter>;
  resolver_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_gt?: InputMaybe<Scalars['String']['input']>;
  resolver_gte?: InputMaybe<Scalars['String']['input']>;
  resolver_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_lt?: InputMaybe<Scalars['String']['input']>;
  resolver_lte?: InputMaybe<Scalars['String']['input']>;
  resolver_not?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains?: InputMaybe<Scalars['String']['input']>;
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  resolver_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with?: InputMaybe<Scalars['String']['input']>;
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum VersionChanged_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Resolver = 'resolver',
  ResolverAddress = 'resolver__address',
  ResolverContentHash = 'resolver__contentHash',
  ResolverId = 'resolver__id',
  TransactionId = 'transactionID',
  Version = 'version'
}

export type WrappedDomain = {
  __typename?: 'WrappedDomain';
  /** The domain that is wrapped by this WrappedDomain */
  domain: Domain;
  /** The expiry date of the wrapped domain */
  expiryDate: Scalars['BigInt']['output'];
  /** The number of fuses remaining on the wrapped domain */
  fuses: Scalars['Int']['output'];
  /** unique identifier for each instance of the WrappedDomain entity */
  id: Scalars['ID']['output'];
  /** The name of the wrapped domain */
  name?: Maybe<Scalars['String']['output']>;
  /** The account that owns this WrappedDomain */
  owner: Account;
};

export type WrappedDomain_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedDomain_Filter>>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fuses?: InputMaybe<Scalars['Int']['input']>;
  fuses_gt?: InputMaybe<Scalars['Int']['input']>;
  fuses_gte?: InputMaybe<Scalars['Int']['input']>;
  fuses_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fuses_lt?: InputMaybe<Scalars['Int']['input']>;
  fuses_lte?: InputMaybe<Scalars['Int']['input']>;
  fuses_not?: InputMaybe<Scalars['Int']['input']>;
  fuses_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<WrappedDomain_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum WrappedDomain_OrderBy {
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  ExpiryDate = 'expiryDate',
  Fuses = 'fuses',
  Id = 'id',
  Name = 'name',
  Owner = 'owner',
  OwnerId = 'owner__id'
}

export type WrappedTransfer = DomainEvent & {
  __typename?: 'WrappedTransfer';
  /** The block number at which the event occurred */
  blockNumber: Scalars['Int']['output'];
  /** The domain name associated with the event */
  domain: Domain;
  /** The unique identifier of the event */
  id: Scalars['ID']['output'];
  /** The account that owns the wrapped domain after the transfer */
  owner: Account;
  /** The transaction hash of the transaction that triggered the event */
  transactionID: Scalars['Bytes']['output'];
};

export type WrappedTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WrappedTransfer_Filter>>>;
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  domain?: InputMaybe<Scalars['String']['input']>;
  domain_?: InputMaybe<Domain_Filter>;
  domain_contains?: InputMaybe<Scalars['String']['input']>;
  domain_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_gt?: InputMaybe<Scalars['String']['input']>;
  domain_gte?: InputMaybe<Scalars['String']['input']>;
  domain_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_lt?: InputMaybe<Scalars['String']['input']>;
  domain_lte?: InputMaybe<Scalars['String']['input']>;
  domain_not?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains?: InputMaybe<Scalars['String']['input']>;
  domain_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  domain_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with?: InputMaybe<Scalars['String']['input']>;
  domain_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WrappedTransfer_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<Account_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionID?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionID_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum WrappedTransfer_OrderBy {
  BlockNumber = 'blockNumber',
  Domain = 'domain',
  DomainCreatedAt = 'domain__createdAt',
  DomainExpiryDate = 'domain__expiryDate',
  DomainId = 'domain__id',
  DomainIsMigrated = 'domain__isMigrated',
  DomainLabelName = 'domain__labelName',
  DomainLabelhash = 'domain__labelhash',
  DomainName = 'domain__name',
  DomainSubdomainCount = 'domain__subdomainCount',
  DomainTtl = 'domain__ttl',
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  TransactionId = 'transactionID'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  DomainEvent: ( ExpiryExtended ) | ( FusesSet ) | ( NameUnwrapped ) | ( NameWrapped ) | ( NewOwner ) | ( NewResolver ) | ( NewTtl ) | ( Transfer ) | ( WrappedTransfer );
  RegistrationEvent: ( NameRegistered ) | ( NameRenewed ) | ( NameTransferred );
  ResolverEvent: ( AbiChanged ) | ( AddrChanged ) | ( AuthorisationChanged ) | ( ContenthashChanged ) | ( InterfaceChanged ) | ( MulticoinAddrChanged ) | ( NameChanged ) | ( PubkeyChanged ) | ( TextChanged ) | ( VersionChanged );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AbiChanged: ResolverTypeWrapper<AbiChanged>;
  AbiChanged_filter: AbiChanged_Filter;
  AbiChanged_orderBy: AbiChanged_OrderBy;
  Account: ResolverTypeWrapper<Account>;
  Account_filter: Account_Filter;
  Account_orderBy: Account_OrderBy;
  AddrChanged: ResolverTypeWrapper<AddrChanged>;
  AddrChanged_filter: AddrChanged_Filter;
  AddrChanged_orderBy: AddrChanged_OrderBy;
  AuthorisationChanged: ResolverTypeWrapper<AuthorisationChanged>;
  AuthorisationChanged_filter: AuthorisationChanged_Filter;
  AuthorisationChanged_orderBy: AuthorisationChanged_OrderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_Height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  ContenthashChanged: ResolverTypeWrapper<ContenthashChanged>;
  ContenthashChanged_filter: ContenthashChanged_Filter;
  ContenthashChanged_orderBy: ContenthashChanged_OrderBy;
  Domain: ResolverTypeWrapper<Domain>;
  DomainEvent: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['DomainEvent']>;
  DomainEvent_filter: DomainEvent_Filter;
  DomainEvent_orderBy: DomainEvent_OrderBy;
  Domain_filter: Domain_Filter;
  Domain_orderBy: Domain_OrderBy;
  ExpiryExtended: ResolverTypeWrapper<ExpiryExtended>;
  ExpiryExtended_filter: ExpiryExtended_Filter;
  ExpiryExtended_orderBy: ExpiryExtended_OrderBy;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FusesSet: ResolverTypeWrapper<FusesSet>;
  FusesSet_filter: FusesSet_Filter;
  FusesSet_orderBy: FusesSet_OrderBy;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  InterfaceChanged: ResolverTypeWrapper<InterfaceChanged>;
  InterfaceChanged_filter: InterfaceChanged_Filter;
  InterfaceChanged_orderBy: InterfaceChanged_OrderBy;
  MulticoinAddrChanged: ResolverTypeWrapper<MulticoinAddrChanged>;
  MulticoinAddrChanged_filter: MulticoinAddrChanged_Filter;
  MulticoinAddrChanged_orderBy: MulticoinAddrChanged_OrderBy;
  NameChanged: ResolverTypeWrapper<NameChanged>;
  NameChanged_filter: NameChanged_Filter;
  NameChanged_orderBy: NameChanged_OrderBy;
  NameRegistered: ResolverTypeWrapper<NameRegistered>;
  NameRegistered_filter: NameRegistered_Filter;
  NameRegistered_orderBy: NameRegistered_OrderBy;
  NameRenewed: ResolverTypeWrapper<NameRenewed>;
  NameRenewed_filter: NameRenewed_Filter;
  NameRenewed_orderBy: NameRenewed_OrderBy;
  NameTransferred: ResolverTypeWrapper<NameTransferred>;
  NameTransferred_filter: NameTransferred_Filter;
  NameTransferred_orderBy: NameTransferred_OrderBy;
  NameUnwrapped: ResolverTypeWrapper<NameUnwrapped>;
  NameUnwrapped_filter: NameUnwrapped_Filter;
  NameUnwrapped_orderBy: NameUnwrapped_OrderBy;
  NameWrapped: ResolverTypeWrapper<NameWrapped>;
  NameWrapped_filter: NameWrapped_Filter;
  NameWrapped_orderBy: NameWrapped_OrderBy;
  NewOwner: ResolverTypeWrapper<NewOwner>;
  NewOwner_filter: NewOwner_Filter;
  NewOwner_orderBy: NewOwner_OrderBy;
  NewResolver: ResolverTypeWrapper<NewResolver>;
  NewResolver_filter: NewResolver_Filter;
  NewResolver_orderBy: NewResolver_OrderBy;
  NewTTL: ResolverTypeWrapper<NewTtl>;
  NewTTL_filter: NewTtl_Filter;
  NewTTL_orderBy: NewTtl_OrderBy;
  OrderDirection: OrderDirection;
  PubkeyChanged: ResolverTypeWrapper<PubkeyChanged>;
  PubkeyChanged_filter: PubkeyChanged_Filter;
  PubkeyChanged_orderBy: PubkeyChanged_OrderBy;
  Query: ResolverTypeWrapper<{}>;
  Registration: ResolverTypeWrapper<Registration>;
  RegistrationEvent: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['RegistrationEvent']>;
  RegistrationEvent_filter: RegistrationEvent_Filter;
  RegistrationEvent_orderBy: RegistrationEvent_OrderBy;
  Registration_filter: Registration_Filter;
  Registration_orderBy: Registration_OrderBy;
  Resolver: ResolverTypeWrapper<Resolver>;
  ResolverEvent: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ResolverEvent']>;
  ResolverEvent_filter: ResolverEvent_Filter;
  ResolverEvent_orderBy: ResolverEvent_OrderBy;
  Resolver_filter: Resolver_Filter;
  Resolver_orderBy: Resolver_OrderBy;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  TextChanged: ResolverTypeWrapper<TextChanged>;
  TextChanged_filter: TextChanged_Filter;
  TextChanged_orderBy: TextChanged_OrderBy;
  Transfer: ResolverTypeWrapper<Transfer>;
  Transfer_filter: Transfer_Filter;
  Transfer_orderBy: Transfer_OrderBy;
  VersionChanged: ResolverTypeWrapper<VersionChanged>;
  VersionChanged_filter: VersionChanged_Filter;
  VersionChanged_orderBy: VersionChanged_OrderBy;
  WrappedDomain: ResolverTypeWrapper<WrappedDomain>;
  WrappedDomain_filter: WrappedDomain_Filter;
  WrappedDomain_orderBy: WrappedDomain_OrderBy;
  WrappedTransfer: ResolverTypeWrapper<WrappedTransfer>;
  WrappedTransfer_filter: WrappedTransfer_Filter;
  WrappedTransfer_orderBy: WrappedTransfer_OrderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AbiChanged: AbiChanged;
  AbiChanged_filter: AbiChanged_Filter;
  Account: Account;
  Account_filter: Account_Filter;
  AddrChanged: AddrChanged;
  AddrChanged_filter: AddrChanged_Filter;
  AuthorisationChanged: AuthorisationChanged;
  AuthorisationChanged_filter: AuthorisationChanged_Filter;
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_Height;
  Boolean: Scalars['Boolean']['output'];
  Bytes: Scalars['Bytes']['output'];
  ContenthashChanged: ContenthashChanged;
  ContenthashChanged_filter: ContenthashChanged_Filter;
  Domain: Domain;
  DomainEvent: ResolversInterfaceTypes<ResolversParentTypes>['DomainEvent'];
  DomainEvent_filter: DomainEvent_Filter;
  Domain_filter: Domain_Filter;
  ExpiryExtended: ExpiryExtended;
  ExpiryExtended_filter: ExpiryExtended_Filter;
  Float: Scalars['Float']['output'];
  FusesSet: FusesSet;
  FusesSet_filter: FusesSet_Filter;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  InterfaceChanged: InterfaceChanged;
  InterfaceChanged_filter: InterfaceChanged_Filter;
  MulticoinAddrChanged: MulticoinAddrChanged;
  MulticoinAddrChanged_filter: MulticoinAddrChanged_Filter;
  NameChanged: NameChanged;
  NameChanged_filter: NameChanged_Filter;
  NameRegistered: NameRegistered;
  NameRegistered_filter: NameRegistered_Filter;
  NameRenewed: NameRenewed;
  NameRenewed_filter: NameRenewed_Filter;
  NameTransferred: NameTransferred;
  NameTransferred_filter: NameTransferred_Filter;
  NameUnwrapped: NameUnwrapped;
  NameUnwrapped_filter: NameUnwrapped_Filter;
  NameWrapped: NameWrapped;
  NameWrapped_filter: NameWrapped_Filter;
  NewOwner: NewOwner;
  NewOwner_filter: NewOwner_Filter;
  NewResolver: NewResolver;
  NewResolver_filter: NewResolver_Filter;
  NewTTL: NewTtl;
  NewTTL_filter: NewTtl_Filter;
  PubkeyChanged: PubkeyChanged;
  PubkeyChanged_filter: PubkeyChanged_Filter;
  Query: {};
  Registration: Registration;
  RegistrationEvent: ResolversInterfaceTypes<ResolversParentTypes>['RegistrationEvent'];
  RegistrationEvent_filter: RegistrationEvent_Filter;
  Registration_filter: Registration_Filter;
  Resolver: Resolver;
  ResolverEvent: ResolversInterfaceTypes<ResolversParentTypes>['ResolverEvent'];
  ResolverEvent_filter: ResolverEvent_Filter;
  Resolver_filter: Resolver_Filter;
  String: Scalars['String']['output'];
  Subscription: {};
  TextChanged: TextChanged;
  TextChanged_filter: TextChanged_Filter;
  Transfer: Transfer;
  Transfer_filter: Transfer_Filter;
  VersionChanged: VersionChanged;
  VersionChanged_filter: VersionChanged_Filter;
  WrappedDomain: WrappedDomain;
  WrappedDomain_filter: WrappedDomain_Filter;
  WrappedTransfer: WrappedTransfer;
  WrappedTransfer_filter: WrappedTransfer_Filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
};

export type DerivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type DerivedFromDirectiveResolver<Result, Parent, ContextType = any, Args = DerivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = { };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SubgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type SubgraphIdDirectiveResolver<Result, Parent, ContextType = any, Args = SubgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbiChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['AbiChanged'] = ResolversParentTypes['AbiChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  contentType?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  domains?: Resolver<Array<ResolversTypes['Domain']>, ParentType, ContextType, RequireFields<AccountDomainsArgs, 'first' | 'skip'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  registrations?: Resolver<Maybe<Array<ResolversTypes['Registration']>>, ParentType, ContextType, RequireFields<AccountRegistrationsArgs, 'first' | 'skip'>>;
  wrappedDomains?: Resolver<Maybe<Array<ResolversTypes['WrappedDomain']>>, ParentType, ContextType, RequireFields<AccountWrappedDomainsArgs, 'first' | 'skip'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddrChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddrChanged'] = ResolversParentTypes['AddrChanged']> = {
  addr?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorisationChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthorisationChanged'] = ResolversParentTypes['AuthorisationChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isAuthorized?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  target?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type ContenthashChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContenthashChanged'] = ResolversParentTypes['ContenthashChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DomainResolvers<ContextType = any, ParentType extends ResolversParentTypes['Domain'] = ResolversParentTypes['Domain']> = {
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['DomainEvent']>, ParentType, ContextType, RequireFields<DomainEventsArgs, 'first' | 'skip'>>;
  expiryDate?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isMigrated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  labelName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  labelhash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Domain']>, ParentType, ContextType>;
  registrant?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  registration?: Resolver<Maybe<ResolversTypes['Registration']>, ParentType, ContextType>;
  resolvedAddress?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  resolver?: Resolver<Maybe<ResolversTypes['Resolver']>, ParentType, ContextType>;
  subdomainCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  subdomains?: Resolver<Array<ResolversTypes['Domain']>, ParentType, ContextType, RequireFields<DomainSubdomainsArgs, 'first' | 'skip'>>;
  ttl?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  wrappedDomain?: Resolver<Maybe<ResolversTypes['WrappedDomain']>, ParentType, ContextType>;
  wrappedOwner?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DomainEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['DomainEvent'] = ResolversParentTypes['DomainEvent']> = {
  __resolveType: TypeResolveFn<'ExpiryExtended' | 'FusesSet' | 'NameUnwrapped' | 'NameWrapped' | 'NewOwner' | 'NewResolver' | 'NewTTL' | 'Transfer' | 'WrappedTransfer', ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
};

export type ExpiryExtendedResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExpiryExtended'] = ResolversParentTypes['ExpiryExtended']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  expiryDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FusesSetResolvers<ContextType = any, ParentType extends ResolversParentTypes['FusesSet'] = ResolversParentTypes['FusesSet']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  fuses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type InterfaceChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['InterfaceChanged'] = ResolversParentTypes['InterfaceChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  implementer?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  interfaceID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MulticoinAddrChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['MulticoinAddrChanged'] = ResolversParentTypes['MulticoinAddrChanged']> = {
  addr?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  coinType?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NameChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['NameChanged'] = ResolversParentTypes['NameChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NameRegisteredResolvers<ContextType = any, ParentType extends ResolversParentTypes['NameRegistered'] = ResolversParentTypes['NameRegistered']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  expiryDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  registrant?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  registration?: Resolver<ResolversTypes['Registration'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NameRenewedResolvers<ContextType = any, ParentType extends ResolversParentTypes['NameRenewed'] = ResolversParentTypes['NameRenewed']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  expiryDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  registration?: Resolver<ResolversTypes['Registration'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NameTransferredResolvers<ContextType = any, ParentType extends ResolversParentTypes['NameTransferred'] = ResolversParentTypes['NameTransferred']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  newOwner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  registration?: Resolver<ResolversTypes['Registration'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NameUnwrappedResolvers<ContextType = any, ParentType extends ResolversParentTypes['NameUnwrapped'] = ResolversParentTypes['NameUnwrapped']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NameWrappedResolvers<ContextType = any, ParentType extends ResolversParentTypes['NameWrapped'] = ResolversParentTypes['NameWrapped']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  expiryDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fuses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NewOwnerResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewOwner'] = ResolversParentTypes['NewOwner']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  parentDomain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NewResolverResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewResolver'] = ResolversParentTypes['NewResolver']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NewTtlResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewTTL'] = ResolversParentTypes['NewTTL']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  ttl?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PubkeyChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['PubkeyChanged'] = ResolversParentTypes['PubkeyChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_MetaArgs>>;
  abiChanged?: Resolver<Maybe<ResolversTypes['AbiChanged']>, ParentType, ContextType, RequireFields<QueryAbiChangedArgs, 'id' | 'subgraphError'>>;
  abiChangeds?: Resolver<Array<ResolversTypes['AbiChanged']>, ParentType, ContextType, RequireFields<QueryAbiChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountArgs, 'id' | 'subgraphError'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountsArgs, 'first' | 'skip' | 'subgraphError'>>;
  addrChanged?: Resolver<Maybe<ResolversTypes['AddrChanged']>, ParentType, ContextType, RequireFields<QueryAddrChangedArgs, 'id' | 'subgraphError'>>;
  addrChangeds?: Resolver<Array<ResolversTypes['AddrChanged']>, ParentType, ContextType, RequireFields<QueryAddrChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  authorisationChanged?: Resolver<Maybe<ResolversTypes['AuthorisationChanged']>, ParentType, ContextType, RequireFields<QueryAuthorisationChangedArgs, 'id' | 'subgraphError'>>;
  authorisationChangeds?: Resolver<Array<ResolversTypes['AuthorisationChanged']>, ParentType, ContextType, RequireFields<QueryAuthorisationChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  contenthashChanged?: Resolver<Maybe<ResolversTypes['ContenthashChanged']>, ParentType, ContextType, RequireFields<QueryContenthashChangedArgs, 'id' | 'subgraphError'>>;
  contenthashChangeds?: Resolver<Array<ResolversTypes['ContenthashChanged']>, ParentType, ContextType, RequireFields<QueryContenthashChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  domain?: Resolver<Maybe<ResolversTypes['Domain']>, ParentType, ContextType, RequireFields<QueryDomainArgs, 'id' | 'subgraphError'>>;
  domainEvent?: Resolver<Maybe<ResolversTypes['DomainEvent']>, ParentType, ContextType, RequireFields<QueryDomainEventArgs, 'id' | 'subgraphError'>>;
  domainEvents?: Resolver<Array<ResolversTypes['DomainEvent']>, ParentType, ContextType, RequireFields<QueryDomainEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  domains?: Resolver<Array<ResolversTypes['Domain']>, ParentType, ContextType, RequireFields<QueryDomainsArgs, 'first' | 'skip' | 'subgraphError'>>;
  expiryExtended?: Resolver<Maybe<ResolversTypes['ExpiryExtended']>, ParentType, ContextType, RequireFields<QueryExpiryExtendedArgs, 'id' | 'subgraphError'>>;
  expiryExtendeds?: Resolver<Array<ResolversTypes['ExpiryExtended']>, ParentType, ContextType, RequireFields<QueryExpiryExtendedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  fusesSet?: Resolver<Maybe<ResolversTypes['FusesSet']>, ParentType, ContextType, RequireFields<QueryFusesSetArgs, 'id' | 'subgraphError'>>;
  fusesSets?: Resolver<Array<ResolversTypes['FusesSet']>, ParentType, ContextType, RequireFields<QueryFusesSetsArgs, 'first' | 'skip' | 'subgraphError'>>;
  interfaceChanged?: Resolver<Maybe<ResolversTypes['InterfaceChanged']>, ParentType, ContextType, RequireFields<QueryInterfaceChangedArgs, 'id' | 'subgraphError'>>;
  interfaceChangeds?: Resolver<Array<ResolversTypes['InterfaceChanged']>, ParentType, ContextType, RequireFields<QueryInterfaceChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  multicoinAddrChanged?: Resolver<Maybe<ResolversTypes['MulticoinAddrChanged']>, ParentType, ContextType, RequireFields<QueryMulticoinAddrChangedArgs, 'id' | 'subgraphError'>>;
  multicoinAddrChangeds?: Resolver<Array<ResolversTypes['MulticoinAddrChanged']>, ParentType, ContextType, RequireFields<QueryMulticoinAddrChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameChanged?: Resolver<Maybe<ResolversTypes['NameChanged']>, ParentType, ContextType, RequireFields<QueryNameChangedArgs, 'id' | 'subgraphError'>>;
  nameChangeds?: Resolver<Array<ResolversTypes['NameChanged']>, ParentType, ContextType, RequireFields<QueryNameChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameRegistered?: Resolver<Maybe<ResolversTypes['NameRegistered']>, ParentType, ContextType, RequireFields<QueryNameRegisteredArgs, 'id' | 'subgraphError'>>;
  nameRegistereds?: Resolver<Array<ResolversTypes['NameRegistered']>, ParentType, ContextType, RequireFields<QueryNameRegisteredsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameRenewed?: Resolver<Maybe<ResolversTypes['NameRenewed']>, ParentType, ContextType, RequireFields<QueryNameRenewedArgs, 'id' | 'subgraphError'>>;
  nameReneweds?: Resolver<Array<ResolversTypes['NameRenewed']>, ParentType, ContextType, RequireFields<QueryNameRenewedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameTransferred?: Resolver<Maybe<ResolversTypes['NameTransferred']>, ParentType, ContextType, RequireFields<QueryNameTransferredArgs, 'id' | 'subgraphError'>>;
  nameTransferreds?: Resolver<Array<ResolversTypes['NameTransferred']>, ParentType, ContextType, RequireFields<QueryNameTransferredsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameUnwrapped?: Resolver<Maybe<ResolversTypes['NameUnwrapped']>, ParentType, ContextType, RequireFields<QueryNameUnwrappedArgs, 'id' | 'subgraphError'>>;
  nameUnwrappeds?: Resolver<Array<ResolversTypes['NameUnwrapped']>, ParentType, ContextType, RequireFields<QueryNameUnwrappedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameWrapped?: Resolver<Maybe<ResolversTypes['NameWrapped']>, ParentType, ContextType, RequireFields<QueryNameWrappedArgs, 'id' | 'subgraphError'>>;
  nameWrappeds?: Resolver<Array<ResolversTypes['NameWrapped']>, ParentType, ContextType, RequireFields<QueryNameWrappedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  newOwner?: Resolver<Maybe<ResolversTypes['NewOwner']>, ParentType, ContextType, RequireFields<QueryNewOwnerArgs, 'id' | 'subgraphError'>>;
  newOwners?: Resolver<Array<ResolversTypes['NewOwner']>, ParentType, ContextType, RequireFields<QueryNewOwnersArgs, 'first' | 'skip' | 'subgraphError'>>;
  newResolver?: Resolver<Maybe<ResolversTypes['NewResolver']>, ParentType, ContextType, RequireFields<QueryNewResolverArgs, 'id' | 'subgraphError'>>;
  newResolvers?: Resolver<Array<ResolversTypes['NewResolver']>, ParentType, ContextType, RequireFields<QueryNewResolversArgs, 'first' | 'skip' | 'subgraphError'>>;
  newTTL?: Resolver<Maybe<ResolversTypes['NewTTL']>, ParentType, ContextType, RequireFields<QueryNewTtlArgs, 'id' | 'subgraphError'>>;
  newTTLs?: Resolver<Array<ResolversTypes['NewTTL']>, ParentType, ContextType, RequireFields<QueryNewTtLsArgs, 'first' | 'skip' | 'subgraphError'>>;
  pubkeyChanged?: Resolver<Maybe<ResolversTypes['PubkeyChanged']>, ParentType, ContextType, RequireFields<QueryPubkeyChangedArgs, 'id' | 'subgraphError'>>;
  pubkeyChangeds?: Resolver<Array<ResolversTypes['PubkeyChanged']>, ParentType, ContextType, RequireFields<QueryPubkeyChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  registration?: Resolver<Maybe<ResolversTypes['Registration']>, ParentType, ContextType, RequireFields<QueryRegistrationArgs, 'id' | 'subgraphError'>>;
  registrationEvent?: Resolver<Maybe<ResolversTypes['RegistrationEvent']>, ParentType, ContextType, RequireFields<QueryRegistrationEventArgs, 'id' | 'subgraphError'>>;
  registrationEvents?: Resolver<Array<ResolversTypes['RegistrationEvent']>, ParentType, ContextType, RequireFields<QueryRegistrationEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  registrations?: Resolver<Array<ResolversTypes['Registration']>, ParentType, ContextType, RequireFields<QueryRegistrationsArgs, 'first' | 'skip' | 'subgraphError'>>;
  resolver?: Resolver<Maybe<ResolversTypes['Resolver']>, ParentType, ContextType, RequireFields<QueryResolverArgs, 'id' | 'subgraphError'>>;
  resolverEvent?: Resolver<Maybe<ResolversTypes['ResolverEvent']>, ParentType, ContextType, RequireFields<QueryResolverEventArgs, 'id' | 'subgraphError'>>;
  resolverEvents?: Resolver<Array<ResolversTypes['ResolverEvent']>, ParentType, ContextType, RequireFields<QueryResolverEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  resolvers?: Resolver<Array<ResolversTypes['Resolver']>, ParentType, ContextType, RequireFields<QueryResolversArgs, 'first' | 'skip' | 'subgraphError'>>;
  textChanged?: Resolver<Maybe<ResolversTypes['TextChanged']>, ParentType, ContextType, RequireFields<QueryTextChangedArgs, 'id' | 'subgraphError'>>;
  textChangeds?: Resolver<Array<ResolversTypes['TextChanged']>, ParentType, ContextType, RequireFields<QueryTextChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  transfer?: Resolver<Maybe<ResolversTypes['Transfer']>, ParentType, ContextType, RequireFields<QueryTransferArgs, 'id' | 'subgraphError'>>;
  transfers?: Resolver<Array<ResolversTypes['Transfer']>, ParentType, ContextType, RequireFields<QueryTransfersArgs, 'first' | 'skip' | 'subgraphError'>>;
  versionChanged?: Resolver<Maybe<ResolversTypes['VersionChanged']>, ParentType, ContextType, RequireFields<QueryVersionChangedArgs, 'id' | 'subgraphError'>>;
  versionChangeds?: Resolver<Array<ResolversTypes['VersionChanged']>, ParentType, ContextType, RequireFields<QueryVersionChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  wrappedDomain?: Resolver<Maybe<ResolversTypes['WrappedDomain']>, ParentType, ContextType, RequireFields<QueryWrappedDomainArgs, 'id' | 'subgraphError'>>;
  wrappedDomains?: Resolver<Array<ResolversTypes['WrappedDomain']>, ParentType, ContextType, RequireFields<QueryWrappedDomainsArgs, 'first' | 'skip' | 'subgraphError'>>;
  wrappedTransfer?: Resolver<Maybe<ResolversTypes['WrappedTransfer']>, ParentType, ContextType, RequireFields<QueryWrappedTransferArgs, 'id' | 'subgraphError'>>;
  wrappedTransfers?: Resolver<Array<ResolversTypes['WrappedTransfer']>, ParentType, ContextType, RequireFields<QueryWrappedTransfersArgs, 'first' | 'skip' | 'subgraphError'>>;
};

export type RegistrationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Registration'] = ResolversParentTypes['Registration']> = {
  cost?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['RegistrationEvent']>, ParentType, ContextType, RequireFields<RegistrationEventsArgs, 'first' | 'skip'>>;
  expiryDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labelName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  registrant?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  registrationDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationEvent'] = ResolversParentTypes['RegistrationEvent']> = {
  __resolveType: TypeResolveFn<'NameRegistered' | 'NameRenewed' | 'NameTransferred', ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  registration?: Resolver<ResolversTypes['Registration'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
};

export type ResolverResolvers<ContextType = any, ParentType extends ResolversParentTypes['Resolver'] = ResolversParentTypes['Resolver']> = {
  addr?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  address?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  coinTypes?: Resolver<Maybe<Array<ResolversTypes['BigInt']>>, ParentType, ContextType>;
  contentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  domain?: Resolver<Maybe<ResolversTypes['Domain']>, ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['ResolverEvent']>, ParentType, ContextType, RequireFields<ResolverEventsArgs, 'first' | 'skip'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  texts?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResolverEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResolverEvent'] = ResolversParentTypes['ResolverEvent']> = {
  __resolveType: TypeResolveFn<'AbiChanged' | 'AddrChanged' | 'AuthorisationChanged' | 'ContenthashChanged' | 'InterfaceChanged' | 'MulticoinAddrChanged' | 'NameChanged' | 'PubkeyChanged' | 'TextChanged' | 'VersionChanged', ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_MetaArgs>>;
  abiChanged?: SubscriptionResolver<Maybe<ResolversTypes['AbiChanged']>, "abiChanged", ParentType, ContextType, RequireFields<SubscriptionAbiChangedArgs, 'id' | 'subgraphError'>>;
  abiChangeds?: SubscriptionResolver<Array<ResolversTypes['AbiChanged']>, "abiChangeds", ParentType, ContextType, RequireFields<SubscriptionAbiChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  account?: SubscriptionResolver<Maybe<ResolversTypes['Account']>, "account", ParentType, ContextType, RequireFields<SubscriptionAccountArgs, 'id' | 'subgraphError'>>;
  accounts?: SubscriptionResolver<Array<ResolversTypes['Account']>, "accounts", ParentType, ContextType, RequireFields<SubscriptionAccountsArgs, 'first' | 'skip' | 'subgraphError'>>;
  addrChanged?: SubscriptionResolver<Maybe<ResolversTypes['AddrChanged']>, "addrChanged", ParentType, ContextType, RequireFields<SubscriptionAddrChangedArgs, 'id' | 'subgraphError'>>;
  addrChangeds?: SubscriptionResolver<Array<ResolversTypes['AddrChanged']>, "addrChangeds", ParentType, ContextType, RequireFields<SubscriptionAddrChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  authorisationChanged?: SubscriptionResolver<Maybe<ResolversTypes['AuthorisationChanged']>, "authorisationChanged", ParentType, ContextType, RequireFields<SubscriptionAuthorisationChangedArgs, 'id' | 'subgraphError'>>;
  authorisationChangeds?: SubscriptionResolver<Array<ResolversTypes['AuthorisationChanged']>, "authorisationChangeds", ParentType, ContextType, RequireFields<SubscriptionAuthorisationChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  contenthashChanged?: SubscriptionResolver<Maybe<ResolversTypes['ContenthashChanged']>, "contenthashChanged", ParentType, ContextType, RequireFields<SubscriptionContenthashChangedArgs, 'id' | 'subgraphError'>>;
  contenthashChangeds?: SubscriptionResolver<Array<ResolversTypes['ContenthashChanged']>, "contenthashChangeds", ParentType, ContextType, RequireFields<SubscriptionContenthashChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  domain?: SubscriptionResolver<Maybe<ResolversTypes['Domain']>, "domain", ParentType, ContextType, RequireFields<SubscriptionDomainArgs, 'id' | 'subgraphError'>>;
  domainEvent?: SubscriptionResolver<Maybe<ResolversTypes['DomainEvent']>, "domainEvent", ParentType, ContextType, RequireFields<SubscriptionDomainEventArgs, 'id' | 'subgraphError'>>;
  domainEvents?: SubscriptionResolver<Array<ResolversTypes['DomainEvent']>, "domainEvents", ParentType, ContextType, RequireFields<SubscriptionDomainEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  domains?: SubscriptionResolver<Array<ResolversTypes['Domain']>, "domains", ParentType, ContextType, RequireFields<SubscriptionDomainsArgs, 'first' | 'skip' | 'subgraphError'>>;
  expiryExtended?: SubscriptionResolver<Maybe<ResolversTypes['ExpiryExtended']>, "expiryExtended", ParentType, ContextType, RequireFields<SubscriptionExpiryExtendedArgs, 'id' | 'subgraphError'>>;
  expiryExtendeds?: SubscriptionResolver<Array<ResolversTypes['ExpiryExtended']>, "expiryExtendeds", ParentType, ContextType, RequireFields<SubscriptionExpiryExtendedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  fusesSet?: SubscriptionResolver<Maybe<ResolversTypes['FusesSet']>, "fusesSet", ParentType, ContextType, RequireFields<SubscriptionFusesSetArgs, 'id' | 'subgraphError'>>;
  fusesSets?: SubscriptionResolver<Array<ResolversTypes['FusesSet']>, "fusesSets", ParentType, ContextType, RequireFields<SubscriptionFusesSetsArgs, 'first' | 'skip' | 'subgraphError'>>;
  interfaceChanged?: SubscriptionResolver<Maybe<ResolversTypes['InterfaceChanged']>, "interfaceChanged", ParentType, ContextType, RequireFields<SubscriptionInterfaceChangedArgs, 'id' | 'subgraphError'>>;
  interfaceChangeds?: SubscriptionResolver<Array<ResolversTypes['InterfaceChanged']>, "interfaceChangeds", ParentType, ContextType, RequireFields<SubscriptionInterfaceChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  multicoinAddrChanged?: SubscriptionResolver<Maybe<ResolversTypes['MulticoinAddrChanged']>, "multicoinAddrChanged", ParentType, ContextType, RequireFields<SubscriptionMulticoinAddrChangedArgs, 'id' | 'subgraphError'>>;
  multicoinAddrChangeds?: SubscriptionResolver<Array<ResolversTypes['MulticoinAddrChanged']>, "multicoinAddrChangeds", ParentType, ContextType, RequireFields<SubscriptionMulticoinAddrChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameChanged?: SubscriptionResolver<Maybe<ResolversTypes['NameChanged']>, "nameChanged", ParentType, ContextType, RequireFields<SubscriptionNameChangedArgs, 'id' | 'subgraphError'>>;
  nameChangeds?: SubscriptionResolver<Array<ResolversTypes['NameChanged']>, "nameChangeds", ParentType, ContextType, RequireFields<SubscriptionNameChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameRegistered?: SubscriptionResolver<Maybe<ResolversTypes['NameRegistered']>, "nameRegistered", ParentType, ContextType, RequireFields<SubscriptionNameRegisteredArgs, 'id' | 'subgraphError'>>;
  nameRegistereds?: SubscriptionResolver<Array<ResolversTypes['NameRegistered']>, "nameRegistereds", ParentType, ContextType, RequireFields<SubscriptionNameRegisteredsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameRenewed?: SubscriptionResolver<Maybe<ResolversTypes['NameRenewed']>, "nameRenewed", ParentType, ContextType, RequireFields<SubscriptionNameRenewedArgs, 'id' | 'subgraphError'>>;
  nameReneweds?: SubscriptionResolver<Array<ResolversTypes['NameRenewed']>, "nameReneweds", ParentType, ContextType, RequireFields<SubscriptionNameRenewedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameTransferred?: SubscriptionResolver<Maybe<ResolversTypes['NameTransferred']>, "nameTransferred", ParentType, ContextType, RequireFields<SubscriptionNameTransferredArgs, 'id' | 'subgraphError'>>;
  nameTransferreds?: SubscriptionResolver<Array<ResolversTypes['NameTransferred']>, "nameTransferreds", ParentType, ContextType, RequireFields<SubscriptionNameTransferredsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameUnwrapped?: SubscriptionResolver<Maybe<ResolversTypes['NameUnwrapped']>, "nameUnwrapped", ParentType, ContextType, RequireFields<SubscriptionNameUnwrappedArgs, 'id' | 'subgraphError'>>;
  nameUnwrappeds?: SubscriptionResolver<Array<ResolversTypes['NameUnwrapped']>, "nameUnwrappeds", ParentType, ContextType, RequireFields<SubscriptionNameUnwrappedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  nameWrapped?: SubscriptionResolver<Maybe<ResolversTypes['NameWrapped']>, "nameWrapped", ParentType, ContextType, RequireFields<SubscriptionNameWrappedArgs, 'id' | 'subgraphError'>>;
  nameWrappeds?: SubscriptionResolver<Array<ResolversTypes['NameWrapped']>, "nameWrappeds", ParentType, ContextType, RequireFields<SubscriptionNameWrappedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  newOwner?: SubscriptionResolver<Maybe<ResolversTypes['NewOwner']>, "newOwner", ParentType, ContextType, RequireFields<SubscriptionNewOwnerArgs, 'id' | 'subgraphError'>>;
  newOwners?: SubscriptionResolver<Array<ResolversTypes['NewOwner']>, "newOwners", ParentType, ContextType, RequireFields<SubscriptionNewOwnersArgs, 'first' | 'skip' | 'subgraphError'>>;
  newResolver?: SubscriptionResolver<Maybe<ResolversTypes['NewResolver']>, "newResolver", ParentType, ContextType, RequireFields<SubscriptionNewResolverArgs, 'id' | 'subgraphError'>>;
  newResolvers?: SubscriptionResolver<Array<ResolversTypes['NewResolver']>, "newResolvers", ParentType, ContextType, RequireFields<SubscriptionNewResolversArgs, 'first' | 'skip' | 'subgraphError'>>;
  newTTL?: SubscriptionResolver<Maybe<ResolversTypes['NewTTL']>, "newTTL", ParentType, ContextType, RequireFields<SubscriptionNewTtlArgs, 'id' | 'subgraphError'>>;
  newTTLs?: SubscriptionResolver<Array<ResolversTypes['NewTTL']>, "newTTLs", ParentType, ContextType, RequireFields<SubscriptionNewTtLsArgs, 'first' | 'skip' | 'subgraphError'>>;
  pubkeyChanged?: SubscriptionResolver<Maybe<ResolversTypes['PubkeyChanged']>, "pubkeyChanged", ParentType, ContextType, RequireFields<SubscriptionPubkeyChangedArgs, 'id' | 'subgraphError'>>;
  pubkeyChangeds?: SubscriptionResolver<Array<ResolversTypes['PubkeyChanged']>, "pubkeyChangeds", ParentType, ContextType, RequireFields<SubscriptionPubkeyChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  registration?: SubscriptionResolver<Maybe<ResolversTypes['Registration']>, "registration", ParentType, ContextType, RequireFields<SubscriptionRegistrationArgs, 'id' | 'subgraphError'>>;
  registrationEvent?: SubscriptionResolver<Maybe<ResolversTypes['RegistrationEvent']>, "registrationEvent", ParentType, ContextType, RequireFields<SubscriptionRegistrationEventArgs, 'id' | 'subgraphError'>>;
  registrationEvents?: SubscriptionResolver<Array<ResolversTypes['RegistrationEvent']>, "registrationEvents", ParentType, ContextType, RequireFields<SubscriptionRegistrationEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  registrations?: SubscriptionResolver<Array<ResolversTypes['Registration']>, "registrations", ParentType, ContextType, RequireFields<SubscriptionRegistrationsArgs, 'first' | 'skip' | 'subgraphError'>>;
  resolver?: SubscriptionResolver<Maybe<ResolversTypes['Resolver']>, "resolver", ParentType, ContextType, RequireFields<SubscriptionResolverArgs, 'id' | 'subgraphError'>>;
  resolverEvent?: SubscriptionResolver<Maybe<ResolversTypes['ResolverEvent']>, "resolverEvent", ParentType, ContextType, RequireFields<SubscriptionResolverEventArgs, 'id' | 'subgraphError'>>;
  resolverEvents?: SubscriptionResolver<Array<ResolversTypes['ResolverEvent']>, "resolverEvents", ParentType, ContextType, RequireFields<SubscriptionResolverEventsArgs, 'first' | 'skip' | 'subgraphError'>>;
  resolvers?: SubscriptionResolver<Array<ResolversTypes['Resolver']>, "resolvers", ParentType, ContextType, RequireFields<SubscriptionResolversArgs, 'first' | 'skip' | 'subgraphError'>>;
  textChanged?: SubscriptionResolver<Maybe<ResolversTypes['TextChanged']>, "textChanged", ParentType, ContextType, RequireFields<SubscriptionTextChangedArgs, 'id' | 'subgraphError'>>;
  textChangeds?: SubscriptionResolver<Array<ResolversTypes['TextChanged']>, "textChangeds", ParentType, ContextType, RequireFields<SubscriptionTextChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  transfer?: SubscriptionResolver<Maybe<ResolversTypes['Transfer']>, "transfer", ParentType, ContextType, RequireFields<SubscriptionTransferArgs, 'id' | 'subgraphError'>>;
  transfers?: SubscriptionResolver<Array<ResolversTypes['Transfer']>, "transfers", ParentType, ContextType, RequireFields<SubscriptionTransfersArgs, 'first' | 'skip' | 'subgraphError'>>;
  versionChanged?: SubscriptionResolver<Maybe<ResolversTypes['VersionChanged']>, "versionChanged", ParentType, ContextType, RequireFields<SubscriptionVersionChangedArgs, 'id' | 'subgraphError'>>;
  versionChangeds?: SubscriptionResolver<Array<ResolversTypes['VersionChanged']>, "versionChangeds", ParentType, ContextType, RequireFields<SubscriptionVersionChangedsArgs, 'first' | 'skip' | 'subgraphError'>>;
  wrappedDomain?: SubscriptionResolver<Maybe<ResolversTypes['WrappedDomain']>, "wrappedDomain", ParentType, ContextType, RequireFields<SubscriptionWrappedDomainArgs, 'id' | 'subgraphError'>>;
  wrappedDomains?: SubscriptionResolver<Array<ResolversTypes['WrappedDomain']>, "wrappedDomains", ParentType, ContextType, RequireFields<SubscriptionWrappedDomainsArgs, 'first' | 'skip' | 'subgraphError'>>;
  wrappedTransfer?: SubscriptionResolver<Maybe<ResolversTypes['WrappedTransfer']>, "wrappedTransfer", ParentType, ContextType, RequireFields<SubscriptionWrappedTransferArgs, 'id' | 'subgraphError'>>;
  wrappedTransfers?: SubscriptionResolver<Array<ResolversTypes['WrappedTransfer']>, "wrappedTransfers", ParentType, ContextType, RequireFields<SubscriptionWrappedTransfersArgs, 'first' | 'skip' | 'subgraphError'>>;
};

export type TextChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['TextChanged'] = ResolversParentTypes['TextChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transfer'] = ResolversParentTypes['Transfer']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VersionChangedResolvers<ContextType = any, ParentType extends ResolversParentTypes['VersionChanged'] = ResolversParentTypes['VersionChanged']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  resolver?: Resolver<ResolversTypes['Resolver'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WrappedDomainResolvers<ContextType = any, ParentType extends ResolversParentTypes['WrappedDomain'] = ResolversParentTypes['WrappedDomain']> = {
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  expiryDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  fuses?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WrappedTransferResolvers<ContextType = any, ParentType extends ResolversParentTypes['WrappedTransfer'] = ResolversParentTypes['WrappedTransfer']> = {
  blockNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  domain?: Resolver<ResolversTypes['Domain'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  transactionID?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Block_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = {
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _Meta_Resolvers<ContextType = any, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = {
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AbiChanged?: AbiChangedResolvers<ContextType>;
  Account?: AccountResolvers<ContextType>;
  AddrChanged?: AddrChangedResolvers<ContextType>;
  AuthorisationChanged?: AuthorisationChangedResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  ContenthashChanged?: ContenthashChangedResolvers<ContextType>;
  Domain?: DomainResolvers<ContextType>;
  DomainEvent?: DomainEventResolvers<ContextType>;
  ExpiryExtended?: ExpiryExtendedResolvers<ContextType>;
  FusesSet?: FusesSetResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  InterfaceChanged?: InterfaceChangedResolvers<ContextType>;
  MulticoinAddrChanged?: MulticoinAddrChangedResolvers<ContextType>;
  NameChanged?: NameChangedResolvers<ContextType>;
  NameRegistered?: NameRegisteredResolvers<ContextType>;
  NameRenewed?: NameRenewedResolvers<ContextType>;
  NameTransferred?: NameTransferredResolvers<ContextType>;
  NameUnwrapped?: NameUnwrappedResolvers<ContextType>;
  NameWrapped?: NameWrappedResolvers<ContextType>;
  NewOwner?: NewOwnerResolvers<ContextType>;
  NewResolver?: NewResolverResolvers<ContextType>;
  NewTTL?: NewTtlResolvers<ContextType>;
  PubkeyChanged?: PubkeyChangedResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Registration?: RegistrationResolvers<ContextType>;
  RegistrationEvent?: RegistrationEventResolvers<ContextType>;
  Resolver?: ResolverResolvers<ContextType>;
  ResolverEvent?: ResolverEventResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TextChanged?: TextChangedResolvers<ContextType>;
  Transfer?: TransferResolvers<ContextType>;
  VersionChanged?: VersionChangedResolvers<ContextType>;
  WrappedDomain?: WrappedDomainResolvers<ContextType>;
  WrappedTransfer?: WrappedTransferResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  derivedFrom?: DerivedFromDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  subgraphId?: SubgraphIdDirectiveResolver<any, any, ContextType>;
};


export const GetNamesDocument = `
    query GetNames {
  nameRegistereds {
    id
    registrant {
      domains {
        id
        labelName
        name
      }
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: module.hot?.status() === "apply",
  endpoints: (build) => ({
    GetNames: build.query<GetNamesQuery, GetNamesQueryVariables | void>({
      query: (variables) => ({ document: GetNamesDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetNamesQuery, useLazyGetNamesQuery } = injectedRtkApi;

