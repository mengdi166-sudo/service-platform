
export enum ConnectorStatus {
  PENDING_REGISTRATION = 'PENDING_REGISTRATION', // 待审核注册
  PENDING_CERTIFICATION = 'PENDING_CERTIFICATION', // 待认证
  PENDING_CERT_AUDIT = 'PENDING_CERT_AUDIT', // 待审核认证
  PENDING_ACTIVATION = 'PENDING_ACTIVATION', // 待激活 (New Step: Download Cert)
  ONLINE = 'ONLINE', // 已激活 (Online)
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
  REVOKED = 'REVOKED'
}

export enum SpaceType {
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED'
}

// --- User & RBAC Types ---
export type UserRole = 'ADMIN' | 'CONSUMER'; // ADMIN: 管理员, CONSUMER: 数据需求方/使用方

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  orgName: string;
  role: UserRole;
  status: 'ACTIVE' | 'DISABLED';
  lastLogin: string;
  email: string;
}

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  industry: string;
  members: number;
  dataCount: number;
  isJoined: boolean;
}

export interface ConnectorEnvironment {
  id?: string; // Platform issued Environment ID (after audit)
  name: string;
  type: 'DATA_SANDBOX' | 'PRIVACY_COMPUTE' | 'TEE' | 'MPC' | 'OTHER';
  description: string;
  attachment?: string; // Filename for verification proof
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Updated Connector Interface based on requirements
export interface Connector {
  id: string; // 接入连接器身份标识1
  name: string; // 接入连接器名称
  
  // Basic Info (Table 10)
  ip: string; // IP地址列表
  dashboardUrl?: string; // 连接器Web管理地址
  domains?: string[]; // 域名列表
  accessMethod?: string; // 接入方式 (专线, 互联网等)
  orgName?: string; // 所属法人名称
  uscc?: string; // 统一社会信用代码
  // credential field removed in previous step, but we might need it back or use a derived state. 
  // keeping it optional if needed for display, but user flow emphasizes CSR upload now.
  credential?: string; 
  csrFile?: string; // 凭证请求文件 (Uploaded in PENDING_CERTIFICATION state)
  certIssueDate?: string; // 凭证颁发日期
  
  // Technical Info (Table 11)
  issuer?: string; // 可验证身份签发单位
  vendorName?: string; // 供应商名称
  vendorCode?: string; // 供应商代码
  sn?: string; // 产品SN号
  version?: string; // 产品版本号
  type?: '0' | '1'; // 连接器类型: 0-标准型, 1-全功能型
  mac: string; // 设备MAC地址

  // Execution Environments (New Requirement)
  environments?: ConnectorEnvironment[];

  // Attachments (Table 12 - boolean represents presence for UI demo)
  attachments?: {
    networkQual?: boolean; // 网络接入资质认证
    levelProtection?: boolean; // 等级保护测评结果
    securityFiling?: boolean; // 网络安全产品备案证明
    cryptoModule?: boolean; // 加密模块认证
    sbom?: boolean; // 软件供应链合规声明
    vulnFix?: boolean; // 安全漏洞修复声明
    protocolCompat?: boolean; // 通信协议兼容性认证
    teeCert?: boolean; // 硬件可信执行环境(TEE)认证
    auditReport?: boolean; // 接入行为审计合规报告
    thirdPartyCert?: boolean; // 第三方认证声明
  };

  // Status & Monitoring
  env: string; // Environment/Architecture
  lastHeartbeat: Date;
  status: ConnectorStatus;
  certExpiryDays: number;
}

export interface PlatformIdentity {
  // Basic Info (Table 14-1)
  name: string;
  id: string;
  ips: string[];
  domains: string[];
  orgName: string;
  uscc: string;
  credential: string;
  issueDate: string;

  // Auxiliary Info (Table 14-2)
  nodeType: '0' | '1' | '2'; // 0-Business, 1-Regional, 2-Global
  industryCode: string;
  serviceScope: string;
  securityContact: string;
  opsProvider: string;
  deploymentEnv: string;
  description?: string;

  // Attachments (Table 15)
  attachments: {
    filing?: boolean;
    auditReport?: boolean;
    apiGatewayCert?: boolean;
    thirdPartyCert?: boolean;
  };
}

export type ProductStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'SUSPENDED';

export interface DataProductField {
  name: string;
  type: string;
  description: string;
  sensitive?: boolean;
}

export interface SensitiveRisk {
  term: string;
  count: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string; // e.g. "隐私泄露", "国家安全"
}

export interface DataProduct {
  id: string;
  name: string;
  provider: string;
  industry?: string; // Mapped from industryCategory in mock
  industryCategory?: string;
  description: string;
  publishDate?: string;
  status?: ProductStatus;
  auditFeedback?: string;
  version?: string;
  
  // Classification
  themeCategory?: string;
  themeType?: string;
  orgType?: string;
  scenarioCategory?: string;
  scenarioType?: string;

  // Audit & Risk details
  schema?: DataProductField[];
  risks?: SensitiveRisk[];
  connectorId?: string; // Provenance
  
  // Policy
  usageConstraints?: {
    maxCalls?: string;
    expiryDate?: string;
    geoRestriction?: string;
  };
  pricing?: any; // Simple or Object

  // Extended fields from new mock
  code?: string;
  sourceType?: string;
  updated?: string;
  securityLevel?: number;
  qualityLevel?: string;
  type?: string;
  assetIds?: string[];
  policyId?: string;
  sampleData?: any;
}

// --- Contract Types ---

export enum ContractStatus {
  NEGOTIATING = 'Negotiating',
  PENDING_SIGNATURE = 'PendingSignature', // Updated from PENDING_SIGN
  SIGNED = 'Signed',
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
  REJECTED = 'Rejected'
}

export enum SignMode {
  BROKER = 'Broker',
  P2P = 'P2P'
}

export interface PolicyConstraints {
  usageCount?: number;
  validUntil?: string;
  environment?: string;
  ipWhitelist?: string;
  geoFence?: string;
  [key: string]: any;
}

export interface Policy {
  actions: string[]; // e.g. ['read', 'desensitize']
  constraints: PolicyConstraints;
}

export interface ContractHistory {
  version: number;
  proposer: 'Me' | 'Counterparty';
  timestamp: string;
  comment: string;
  policySnapshot: Policy;
}

export interface ContractSignature {
  role: 'Provider' | 'Consumer';
  signerName: string;
  signerDid: string;
  hash: string;
  timestamp: string;
  status: 'Valid' | 'Revoked';
}

export interface ExecutionStats {
  totalCalls: number;
  remainingCalls: number;
  dataVolume: string;
  lastCallTime: string;
  healthStatus: 'Normal' | 'Warning' | 'Error';
}

export interface ContractLog {
  id: string;
  timestamp: string;
  result: 'ALLOWED' | 'DENIED';
  connectorId: string;
  policyId: string;
  context: string;
  signature: string;
}

export interface Contract {
  id: string;
  name: string; // was title
  description: string;
  role: 'Provider' | 'Consumer'; // Capitalized in new mock
  
  // Relationships
  productId: string;
  productName: string;
  counterpartyName: string; // was counterparty
  counterpartyDid: string;
  signatorySpecifiedPointId: string; // Connection Point ID

  // State
  status: ContractStatus;
  signMode: SignMode;
  version: number;
  lastUpdated: string; // was updatedAt / date

  // Policy Data
  myPolicy: Policy;
  counterpartyPolicy: Policy;
  
  // History
  history: ContractHistory[];

  // Evidence & Execution (New)
  signatures?: ContractSignature[];
  executionStats?: ExecutionStats;
  logs?: ContractLog[];
}
