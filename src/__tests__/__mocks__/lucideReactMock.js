import React from 'react';

// Mock for lucide-react icons
const createIconMock = (name) => {
  const IconComponent = ({ size = 24, strokeWidth = 2, className, ...props }) => {
    return React.createElement('svg', {
      'data-testid': `icon-${name.toLowerCase()}`,
      width: size,
      height: size,
      strokeWidth,
      className,
      ...props,
      children: React.createElement('path', {
        d: 'M0 0h24v24H0z',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    });
  };
  
  IconComponent.displayName = name;
  return IconComponent;
};

// Export commonly used icons
export const Search = createIconMock('Search');
export const Filter = createIconMock('Filter');
export const MapPin = createIconMock('MapPin');
export const Calendar = createIconMock('Calendar');
export const Clock = createIconMock('Clock');
export const Users = createIconMock('Users');
export const User = createIconMock('User');
export const Settings = createIconMock('Settings');
export const Bell = createIconMock('Bell');
export const Mail = createIconMock('Mail');
export const Phone = createIconMock('Phone');
export const Globe = createIconMock('Globe');
export const Linkedin = createIconMock('Linkedin');
export const Facebook = createIconMock('Facebook');
export const Twitter = createIconMock('Twitter');
export const Instagram = createIconMock('Instagram');
export const Github = createIconMock('Github');
export const ExternalLink = createIconMock('ExternalLink');
export const Edit = createIconMock('Edit');
export const Trash = createIconMock('Trash');
export const Plus = createIconMock('Plus');
export const Minus = createIconMock('Minus');
export const Check = createIconMock('Check');
export const X = createIconMock('X');
export const ChevronDown = createIconMock('ChevronDown');
export const ChevronUp = createIconMock('ChevronUp');
export const ChevronLeft = createIconMock('ChevronLeft');
export const ChevronRight = createIconMock('ChevronRight');
export const Menu = createIconMock('Menu');
export const Close = createIconMock('Close');
export const Home = createIconMock('Home');
export const LogOut = createIconMock('LogOut');
export const LogIn = createIconMock('LogIn');
export const Eye = createIconMock('Eye');
export const EyeOff = createIconMock('EyeOff');
export const Lock = createIconMock('Lock');
export const Unlock = createIconMock('Unlock');
export const Key = createIconMock('Key');
export const Shield = createIconMock('Shield');
export const AlertCircle = createIconMock('AlertCircle');
export const Info = createIconMock('Info');
export const CheckCircle = createIconMock('CheckCircle');
export const XCircle = createIconMock('XCircle');
export const HelpCircle = createIconMock('HelpCircle');
export const Star = createIconMock('Star');
export const Heart = createIconMock('Heart');
export const ThumbsUp = createIconMock('ThumbsUp');
export const ThumbsDown = createIconMock('ThumbsDown');
export const MessageCircle = createIconMock('MessageCircle');
export const Send = createIconMock('Send');
export const Paperclip = createIconMock('Paperclip');
export const Image = createIconMock('Image');
export const File = createIconMock('File');
export const Download = createIconMock('Download');
export const Upload = createIconMock('Upload');
export const Share = createIconMock('Share');
export const Copy = createIconMock('Copy');
export const Link = createIconMock('Link');
export const Bookmark = createIconMock('Bookmark');
export const Flag = createIconMock('Flag');
export const MoreHorizontal = createIconMock('MoreHorizontal');
export const MoreVertical = createIconMock('MoreVertical');
export const Grid = createIconMock('Grid');
export const List = createIconMock('List');
export const ZoomIn = createIconMock('ZoomIn');
export const ZoomOut = createIconMock('ZoomOut');
export const RotateCcw = createIconMock('RotateCcw');
export const RotateCw = createIconMock('RotateCw');
export const RefreshCw = createIconMock('RefreshCw');
export const RefreshCcw = createIconMock('RefreshCcw');
export const Play = createIconMock('Play');
export const Pause = createIconMock('Pause');
export const SkipBack = createIconMock('SkipBack');
export const SkipForward = createIconMock('SkipForward');
export const Volume = createIconMock('Volume');
export const VolumeX = createIconMock('VolumeX');
export const Volume1 = createIconMock('Volume1');
export const Volume2 = createIconMock('Volume2');
export const Mic = createIconMock('Mic');
export const MicOff = createIconMock('MicOff');
export const Video = createIconMock('Video');
export const VideoOff = createIconMock('VideoOff');
export const Camera = createIconMock('Camera');
export const CameraOff = createIconMock('CameraOff');
export const Monitor = createIconMock('Monitor');
export const Smartphone = createIconMock('Smartphone');
export const Tablet = createIconMock('Tablet');
export const Laptop = createIconMock('Laptop');
export const Desktop = createIconMock('Desktop');
export const Server = createIconMock('Server');
export const Database = createIconMock('Database');
export const HardDrive = createIconMock('HardDrive');
export const Cpu = createIconMock('Cpu');
export const Memory = createIconMock('Memory');
export const Network = createIconMock('Network');
export const Wifi = createIconMock('Wifi');
export const WifiOff = createIconMock('WifiOff');
export const Bluetooth = createIconMock('Bluetooth');
export const BluetoothOff = createIconMock('BluetoothOff');
export const Signal = createIconMock('Signal');
export const SignalHigh = createIconMock('SignalHigh');
export const SignalMedium = createIconMock('SignalMedium');
export const SignalLow = createIconMock('SignalLow');
export const Battery = createIconMock('Battery');
export const BatteryCharging = createIconMock('BatteryCharging');
export const BatteryFull = createIconMock('BatteryFull');
export const BatteryLow = createIconMock('BatteryLow');
export const BatteryEmpty = createIconMock('BatteryEmpty');
export const Power = createIconMock('Power');
export const PowerOff = createIconMock('PowerOff');
export const Zap = createIconMock('Zap');
export const ZapOff = createIconMock('ZapOff');
export const Sun = createIconMock('Sun');
export const Moon = createIconMock('Moon');
export const Cloud = createIconMock('Cloud');
export const CloudRain = createIconMock('CloudRain');
export const CloudSnow = createIconMock('CloudSnow');
export const CloudLightning = createIconMock('CloudLightning');
export const CloudDrizzle = createIconMock('CloudDrizzle');
export const CloudFog = createIconMock('CloudFog');
export const Wind = createIconMock('Wind');
export const Thermometer = createIconMock('Thermometer');
export const Droplets = createIconMock('Droplets');
export const Umbrella = createIconMock('Umbrella');
export const Sunrise = createIconMock('Sunrise');
export const Sunset = createIconMock('Sunset');
export const Navigation = createIconMock('Navigation');
export const Navigation2 = createIconMock('Navigation2');
export const Compass = createIconMock('Compass');
export const Map = createIconMock('Map');
export const Globe2 = createIconMock('Globe2');
export const Building = createIconMock('Building');
export const Home2 = createIconMock('Home2');
export const Store = createIconMock('Store');
export const ShoppingCart = createIconMock('ShoppingCart');
export const CreditCard = createIconMock('CreditCard');
export const DollarSign = createIconMock('DollarSign');
export const Euro = createIconMock('Euro');
export const PoundSterling = createIconMock('PoundSterling');
export const Yen = createIconMock('Yen');
export const Bitcoin = createIconMock('Bitcoin');
export const TrendingUp = createIconMock('TrendingUp');
export const TrendingDown = createIconMock('TrendingDown');
export const BarChart = createIconMock('BarChart');
export const BarChart2 = createIconMock('BarChart2');
export const BarChart3 = createIconMock('BarChart3');
export const LineChart = createIconMock('LineChart');
export const PieChart = createIconMock('PieChart');
export const Activity = createIconMock('Activity');
export const Target = createIconMock('Target');
export const Award = createIconMock('Award');
export const Trophy = createIconMock('Trophy');
export const Medal = createIconMock('Medal');
export const Gift = createIconMock('Gift');
export const Package = createIconMock('Package');
export const Truck = createIconMock('Truck');
export const Car = createIconMock('Car');
export const Bike = createIconMock('Bike');
export const Bus = createIconMock('Bus');
export const Train = createIconMock('Train');
export const Plane = createIconMock('Plane');
export const Ship = createIconMock('Ship');
export const Anchor = createIconMock('Anchor');
export const LifeBuoy = createIconMock('LifeBuoy');
export const Compass2 = createIconMock('Compass2');
export const MapPin2 = createIconMock('MapPin2');
export const Navigation3 = createIconMock('Navigation3');
export const Route = createIconMock('Route');
export const Flag2 = createIconMock('Flag2');
export const Flag3 = createIconMock('Flag3');
export const Flag4 = createIconMock('Flag4');
export const Flag5 = createIconMock('Flag5');
export const Flag6 = createIconMock('Flag6');
export const Flag7 = createIconMock('Flag7');
export const Flag8 = createIconMock('Flag8');
export const Flag9 = createIconMock('Flag9');
export const Flag10 = createIconMock('Flag10');

// Default export for backward compatibility
export default {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  Settings,
  Bell,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Github,
  ExternalLink,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Close,
  Home,
  LogOut,
  LogIn,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Shield,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Paperclip,
  Image,
  File,
  Download,
  Upload,
  Share,
  Copy,
  Link,
  Bookmark,
  Flag,
  MoreHorizontal,
  MoreVertical,
  Grid,
  List,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  RefreshCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Database,
  HardDrive,
  Cpu,
  Memory,
  Network,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryEmpty,
  Power,
  PowerOff,
  Zap,
  ZapOff,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Sunrise,
  Sunset,
  Navigation,
  Navigation2,
  Compass,
  Map,
  Globe2,
  Building,
  Home2,
  Store,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  BarChart,
  BarChart2,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target,
  Award,
  Trophy,
  Medal,
  Gift,
  Package,
  Truck,
  Car,
  Bike,
  Bus,
  Train,
  Plane,
  Ship,
  Anchor,
  LifeBuoy,
  Compass2,
  MapPin2,
  Navigation3,
  Route,
  Flag2,
  Flag3,
  Flag4,
  Flag5,
  Flag6,
  Flag7,
  Flag8,
  Flag9,
  Flag10,
}; 