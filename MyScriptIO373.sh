#!/bin/bash

# Deployment Automation Script for React Frontend and Python Backend
# This script automates the deployment process for accelerators

set -e  # Exit on any error

# Usage: ./deploy.sh <DOMAIN> <AWS_REGION> <REPO_NAME> <FRONTEND_PORT> <BACKEND_PORT>
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage: $0 [DOMAIN] [AWS_REGION] [REPO_NAME] [FRONTEND_PORT] [BACKEND_PORT]"
    echo "Defaults:"
    echo "  REPO_NAME=cctr-test"
    echo "  FRONTEND_PORT=3000"
    echo "  BACKEND_PORT=8000"
    exit 0
fi

REPO_NAME="${1:-cctr-test}"
FRONTEND_PORT="${2:-3000}"
BACKEND_PORT="${3:-8000}"

# Configuration Variables
DOMAIN="srm-tech.com"
AWS_REGION="ap-south-1"
S3_BUCKET_NAME="srm-deployment-files"
REPO_URL="https://git-codecommit.ap-south-1.amazonaws.com/v1/repos/$REPO_NAME"
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" -s)
EC2_PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate prerequisites
validate_prerequisites() {
    print_status "Validating prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists aws; then
        missing_tools+=("AWS CLI")
    fi
    
    if ! command_exists git; then
        missing_tools+=("Git")
    fi
    
    if ! command_exists docker; then
        missing_tools+=("Docker")
    fi
    
    if ! command_exists docker compose; then
        missing_tools+=("Docker Compose")
    fi
    
    if ! command_exists certbot; then
        missing_tools+=("Certbot")
    fi
    
    if ! command_exists nginx; then
        missing_tools+=("Nginx")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_error "Please install the missing tools and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to get repository name from git URL
get_repo_name() {
    local git_url="$1"
    REPO_NAME=$(basename "$git_url" .git)
    print_status "Repository name: $REPO_NAME"
}

# Function to clone repository
clone_repository() {
    local repo_url="$1"
    
    print_status "Cloning repository from $repo_url..."
    
    if [ -d "$REPO_NAME" ]; then
        print_warning "Directory $REPO_NAME already exists. Removing it..."
        rm -rf "$REPO_NAME"
    fi
    
    git clone "$repo_url"
    
    if [ $? -eq 0 ]; then
        print_success "Repository cloned successfully"
        cd "$REPO_NAME"
    else
        print_error "Failed to clone repository"
        exit 1
    fi
}

# Function to download Docker files from S3
download_docker_files() {
    print_status "Downloading Docker files from S3..."
    
    # Download frontend Dockerfile
    print_status "Downloading frontend Dockerfile..."
    aws s3 cp "s3://$S3_BUCKET_NAME/dockerfiles/frontend/Dockerfile" "frontend/Dockerfile" --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        print_success "Frontend Dockerfile downloaded"
    else
        print_error "Failed to download frontend Dockerfile"
        exit 1
    fi
    
    # Download backend Dockerfile
    print_status "Downloading backend Dockerfile..."
    aws s3 cp "s3://$S3_BUCKET_NAME/dockerfiles/backend/Dockerfile" "backend/Dockerfile" --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        print_success "Backend Dockerfile downloaded"
    else
        print_error "Failed to download backend Dockerfile"
        exit 1
    fi
    
    # Download docker-compose.yml
    print_status "Downloading docker-compose.yml..."
    aws s3 cp "s3://$S3_BUCKET_NAME/dockerfiles/docker-compose.yml" "docker-compose.yml" --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        print_success "Docker Compose file downloaded"
    else
        print_error "Failed to download docker-compose.yml"
        exit 1
    fi
}

# Function to create nginx configuration
create_nginx_config() {
    print_status "Creating nginx configuration files..."
    
    # Create certs directory
    mkdir -p certs
    
    # Frontend nginx configuration (without SSL certificate paths for initial setup)
    cat > certs/frontend.conf << EOF
server {
    server_name $REPO_NAME.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeout settings
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }

    listen 80;
}
EOF
    
    # Backend nginx configuration (without SSL certificate paths for initial setup)
    cat > certs/backend.conf << EOF
server {
    server_name $REPO_NAME-api.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeout settings
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }

    listen 80;
}
EOF
    
    print_success "Nginx configuration files created (without SSL paths)"
}

# Function to setup nginx configuration
setup_nginx_config() {
    print_status "Setting up nginx configuration..."
    
    # Check if nginx is installed
    if ! command -v nginx >/dev/null 2>&1; then
        print_error "Nginx is not installed. Please install nginx first."
        exit 1
    fi
    
    # Copy frontend configuration to sites-available
    print_status "Copying frontend nginx configuration..."
    sudo cp certs/frontend.conf /etc/nginx/sites-available/$REPO_NAME.$DOMAIN
    
    # Copy backend configuration to sites-available
    print_status "Copying backend nginx configuration..."
    sudo cp certs/backend.conf /etc/nginx/sites-available/$REPO_NAME-api.$DOMAIN
    
    # Create symbolic links to sites-enabled
    print_status "Creating symbolic links..."
    sudo ln -sf /etc/nginx/sites-available/$REPO_NAME.$DOMAIN /etc/nginx/sites-enabled/
    sudo ln -sf /etc/nginx/sites-available/$REPO_NAME-api.$DOMAIN /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    print_status "Testing nginx configuration..."
    if sudo nginx -t; then
        print_success "Nginx configuration test passed"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
    
    # Restart nginx
    print_status "Restarting nginx..."
    if sudo systemctl restart nginx; then
        print_success "Nginx restarted successfully"
    else
        print_error "Failed to restart nginx"
        exit 1
    fi
    
    # Wait a moment for nginx to fully start
    sleep 3
    
    print_success "Nginx configuration setup completed"
}

# Function to create Route 53 records
create_route53_records() {
    print_status "Creating Route 53 records..."
    
    # Get hosted zone ID
    local hosted_zone_id=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN.'].Id" --output text --region "$AWS_REGION")
    
    if [ -z "$hosted_zone_id" ]; then
        print_error "Hosted zone for domain $DOMAIN not found"
        exit 1
    fi
    
    # Remove the trailing slash from hosted zone ID
    hosted_zone_id=${hosted_zone_id#/hostedzone/}
    
    # Create change batch for frontend
    cat > route53-frontend.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$REPO_NAME.$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "YOUR_EC2_PUBLIC_IP"
                    }
                ]
            }
        }
    ]
}
EOF
    
    # Create change batch for backend
    cat > route53-backend.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$REPO_NAME-api.$DOMAIN",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "YOUR_EC2_PUBLIC_IP"
                    }
                ]
            }
        }
    ]
}
EOF
    
    print_warning "Route 53 change files created. Please update the EC2 public IP in route53-frontend.json and route53-backend.json"
    print_warning "Then run: aws route53 change-resource-record-sets --hosted-zone-id $hosted_zone_id --change-batch file://route53-frontend.json"
    print_warning "And: aws route53 change-resource-record-sets --hosted-zone-id $hosted_zone_id --change-batch file://route53-backend.json"


    if [ -z "$EC2_PUBLIC_IP" ]; then
        echo "ERROR: Could not determine EC2 public IP. Please set EC2_PUBLIC_IP manually."
        exit 1
    fi

    echo "EC2_PUBLIC_IP is: $EC2_PUBLIC_IP"

    # Replace placeholder in JSON files
    sed -i "s/YOUR_EC2_PUBLIC_IP/$EC2_PUBLIC_IP/g" route53-frontend.json
    sed -i "s/YOUR_EC2_PUBLIC_IP/$EC2_PUBLIC_IP/g" route53-backend.json

    # Apply the changes
    aws route53 change-resource-record-sets --hosted-zone-id $hosted_zone_id --change-batch file://route53-frontend.json --region $AWS_REGION
    aws route53 change-resource-record-sets --hosted-zone-id $hosted_zone_id --change-batch file://route53-backend.json --region $AWS_REGION
}

# Function to generate SSL certificates
generate_ssl_certificates() {
    print_status "Generating SSL certificates using Certbot..."
    
    # Stop any running containers to free up ports
    docker-compose down 2>/dev/null || true
    
    # Generate certificate for frontend
    print_status "Generating certificate for $REPO_NAME.$DOMAIN..."
    certbot certonly --standalone -d "$REPO_NAME.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
    
    if [ $? -eq 0 ]; then
        print_success "Frontend certificate generated"
    else
        print_error "Failed to generate frontend certificate"
        exit 1
    fi
    
    # Generate certificate for backend
    print_status "Generating certificate for $REPO_NAME-api.$DOMAIN..."
    certbot certonly --standalone -d "$REPO_NAME-api.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
    
    if [ $? -eq 0 ]; then
        print_success "Backend certificate generated"
    else
        print_error "Failed to generate backend certificate"
        exit 1
    fi
}

# Function to update nginx configuration with SSL certificates
update_nginx_with_ssl() {
    print_status "Updating nginx configuration with SSL certificates..."
    
    # Update frontend configuration with SSL
    cat > /tmp/frontend_ssl.conf << EOF
server {
    server_name $REPO_NAME.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeout settings
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/$REPO_NAME.$DOMAIN/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$REPO_NAME.$DOMAIN/privkey.pem; # managed by Certbot
}
server {
    if (\$host = $REPO_NAME.$DOMAIN) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    server_name $REPO_NAME.$DOMAIN;
    listen 80;
    return 404; # managed by Certbot
}
EOF
    
    # Update backend configuration with SSL
    cat > /tmp/backend_ssl.conf << EOF
server {
    server_name $REPO_NAME-api.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeout settings
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/$REPO_NAME-api.$DOMAIN/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$REPO_NAME-api.$DOMAIN/privkey.pem; # managed by Certbot
}
server {
    if (\$host = $REPO_NAME-api.$DOMAIN) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    server_name $REPO_NAME-api.$DOMAIN;
    listen 80;
    return 404; # managed by Certbot
}
EOF
    
    # Copy updated configurations
    sudo cp /tmp/frontend_ssl.conf /etc/nginx/sites-available/$REPO_NAME.$DOMAIN
    sudo cp /tmp/backend_ssl.conf /etc/nginx/sites-available/$REPO_NAME-api.$DOMAIN
    
    # Test nginx configuration
    print_status "Testing nginx configuration with SSL..."
    if sudo nginx -t; then
        print_success "Nginx configuration test passed"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
    
    # Reload nginx
    print_status "Reloading nginx..."
    if sudo systemctl reload nginx; then
        print_success "Nginx reloaded successfully with SSL configuration"
    else
        print_error "Failed to reload nginx"
        exit 1
    fi
    
    # Clean up temporary files
    rm -f /tmp/frontend_ssl.conf /tmp/backend_ssl.conf
    
    # Copy updated nginx configurations back to certs folder in repository
    print_status "Copying updated nginx configurations to certs folder..."
    cp /etc/nginx/sites-available/$REPO_NAME.$DOMAIN certs/frontend.conf
    cp /etc/nginx/sites-available/$REPO_NAME-api.$DOMAIN certs/backend.conf
    
    print_success "Nginx configuration updated with SSL certificates and copied to certs folder"
}

# Function to copy certificates to S3
copy_certificates_to_s3() {
    print_status "Copying certificates to S3..."
    
    # Create certificates directory structure in S3 if it doesn't exist
    aws s3api put-object --bucket "$S3_BUCKET_NAME" --key "certificates/$REPO_NAME/" --region "$AWS_REGION" 2>/dev/null || true
    aws s3api put-object --bucket "$S3_BUCKET_NAME" --key "certificates/$REPO_NAME/$REPO_NAME.$DOMAIN/" --region "$AWS_REGION" 2>/dev/null || true
    aws s3api put-object --bucket "$S3_BUCKET_NAME" --key "certificates/$REPO_NAME/$REPO_NAME-api.$DOMAIN/" --region "$AWS_REGION" 2>/dev/null || true
    
    # Copy frontend certificates
    print_status "Copying frontend certificates..."
    # Get the latest certificate version from archive
    local frontend_fullchain=$(ls -t /etc/letsencrypt/archive/$REPO_NAME.$DOMAIN/fullchain*.pem | head -1)
    local frontend_privkey=$(ls -t /etc/letsencrypt/archive/$REPO_NAME.$DOMAIN/privkey*.pem | head -1)
    
    # Verify certificate files exist
    if [ ! -f "$frontend_fullchain" ] || [ ! -f "$frontend_privkey" ]; then
        print_error "Frontend certificate files not found in archive"
        exit 1
    fi
    
    aws s3 cp "$frontend_fullchain" "s3://$S3_BUCKET_NAME/certificates/$REPO_NAME/$REPO_NAME.$DOMAIN/fullchain.pem" --region "$AWS_REGION"
    aws s3 cp "$frontend_privkey" "s3://$S3_BUCKET_NAME/certificates/$REPO_NAME/$REPO_NAME.$DOMAIN/privkey.pem" --region "$AWS_REGION"
    
    # Copy backend certificates
    print_status "Copying backend certificates..."
    # Get the latest certificate version from archive
    local backend_fullchain=$(ls -t /etc/letsencrypt/archive/$REPO_NAME-api.$DOMAIN/fullchain*.pem | head -1)
    local backend_privkey=$(ls -t /etc/letsencrypt/archive/$REPO_NAME-api.$DOMAIN/privkey*.pem | head -1)
    
    # Verify certificate files exist
    if [ ! -f "$backend_fullchain" ] || [ ! -f "$backend_privkey" ]; then
        print_error "Backend certificate files not found in archive"
        exit 1
    fi
    
    aws s3 cp "$backend_fullchain" "s3://$S3_BUCKET_NAME/certificates/$REPO_NAME/$REPO_NAME-api.$DOMAIN/fullchain.pem" --region "$AWS_REGION"
    aws s3 cp "$backend_privkey" "s3://$S3_BUCKET_NAME/certificates/$REPO_NAME/$REPO_NAME-api.$DOMAIN/privkey.pem" --region "$AWS_REGION"
    
    print_success "Certificates copied to S3 successfully"
}

# Function to commit changes
commit_changes() {
    print_status "Committing changes to repository..."
    
    # Add all changes except route53 JSON files
    git add .
    git reset route53-frontend.json route53-backend.json 2>/dev/null || true
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        print_warning "No changes to commit"
        return
    fi
    
    # Commit changes
    git commit -m "Automated deployment: Added Docker files, nginx config, and certificates
    
    - Added frontend and backend Dockerfiles
    - Added docker-compose.yml
    - Added nginx configuration files with SSL certificate paths
    - Generated SSL certificates for $REPO_NAME.$DOMAIN and $REPO_NAME-api.$DOMAIN
    - Certificates uploaded to S3 bucket
    - Updated nginx configs in certs folder with live certificate paths"
    
    if [ $? -eq 0 ]; then
        print_success "Changes committed successfully"
        print_status "Pushing changes to remote repository..."
        git push
        if [ $? -eq 0 ]; then
            print_success "Changes pushed to remote repository successfully"
            print_status "Cleaning up Route 53 change files..."
            rm -f route53-frontend.json route53-backend.json
            print_success "Route 53 change files removed"
        else
            print_error "Failed to push changes to remote repository"
        fi
    else
        print_error "Failed to commit changes"
        exit 1
    fi
}

# Function to delete Route 53 records
delete_route53_records() {
    print_status "Deleting Route 53 records..."

    # Get hosted zone ID
    local hosted_zone_id=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN.'].Id" --output text --region "$AWS_REGION")
    if [ -z "$hosted_zone_id" ]; then
        print_error "Hosted zone for domain $DOMAIN not found"
        return
    fi
    hosted_zone_id=${hosted_zone_id#/hostedzone/}

    # Create delete batch for frontend
    cat > route53-delete-frontend.json << EOF
{
  "Changes": [
    {
      "Action": "DELETE",
      "ResourceRecordSet": {
        "Name": "$REPO_NAME.$DOMAIN",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [
          { "Value": "$EC2_PUBLIC_IP" }
        ]
      }
    }
  ]
}
EOF

    # Create delete batch for backend
    cat > route53-delete-backend.json << EOF
{
  "Changes": [
    {
      "Action": "DELETE",
      "ResourceRecordSet": {
        "Name": "$REPO_NAME-api.$DOMAIN",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [
          { "Value": "$EC2_PUBLIC_IP" }
        ]
      }
    }
  ]
}
EOF

    # Delete the records
    print_status "Deleting frontend record..."
    aws route53 change-resource-record-sets --hosted-zone-id $hosted_zone_id --change-batch file://route53-delete-frontend.json --region $AWS_REGION || print_warning "Failed to delete frontend record (it may not exist)"
    print_status "Deleting backend record..."
    aws route53 change-resource-record-sets --hosted-zone-id $hosted_zone_id --change-batch file://route53-delete-backend.json --region $AWS_REGION || print_warning "Failed to delete backend record (it may not exist)"

    # Clean up
    rm -f route53-delete-frontend.json route53-delete-backend.json
    print_success "Route 53 records deletion attempted and temp files removed"
}

# Function to sync and update Terraform folder from S3
update_terraform_folder() {
    print_status "Syncing Terraform folder from S3..."

    # Download Terraform folder from S3 to a temp location
    aws s3 cp s3://$S3_BUCKET_NAME/Terraform/ /tmp/Terraform/ --recursive --region "$AWS_REGION"
    print_success "Terraform folder downloaded from S3"

    # Copy Terraform folder into the root of the cloned repo
    cp -r /tmp/Terraform "$REPO_NAME/Terraform"

    # Update repo_name in deploy.tfvars
    if [ -f "$REPO_NAME/Terraform/config/deploy.tfvars" ]; then
        sed -i "s/^repo_name *= *.*/repo_name = \"$REPO_NAME\"/" "$REPO_NAME/Terraform/config/deploy.tfvars"
        print_success "Updated repo_name in deploy.tfvars"
    fi

    # Update repo_name in destroy.tfvars
    if [ -f "$REPO_NAME/Terraform/config/destroy.tfvars" ]; then
        sed -i "s/^repo_name *= *.*/repo_name = \"$REPO_NAME\"/" "$REPO_NAME/Terraform/config/destroy.tfvars"
        print_success "Updated repo_name in destroy.tfvars"
    fi

    # Update REPO_NAME in data.sh
    if [ -f "$REPO_NAME/Terraform/data.sh" ]; then
        sed -i "s/^REPO_NAME=.*/REPO_NAME=\"$REPO_NAME\"/" "$REPO_NAME/Terraform/data.sh"
        print_success "Updated REPO_NAME in data.sh"
    fi

    # Commit and push changes from inside the cloned repo
    cd "$REPO_NAME"
    git add Terraform/
    git commit -m "Update repo_name to $REPO_NAME in Terraform files"
    git push
    cd ..
    print_success "Terraform changes committed and pushed"
}

# Function to create and publish iac branch from main
create_iac_branch() {
    print_status "Creating and publishing iac branch from main..."
    
    # Navigate to the repository directory
    cd "$REPO_NAME"
    
    # Ensure we're on the main branch and it's up to date
    print_status "Switching to main branch and pulling latest changes..."
    git checkout main
    git pull origin main
    
    # Check if iac branch already exists
    if git show-ref --verify --quiet refs/heads/iac; then
        print_warning "iac branch already exists. Deleting it to recreate from main..."
        git branch -D iac
        git push origin --delete iac 2>/dev/null || true
    fi
    
    # Create new iac branch from main
    print_status "Creating new iac branch from main..."
    git checkout -b iac
    
    if [ $? -eq 0 ]; then
        print_success "iac branch created successfully"
        
        # Push the iac branch to remote
        print_status "Publishing iac branch to remote repository..."
        git push -u origin iac
        
        if [ $? -eq 0 ]; then
            print_success "iac branch published successfully"
        else
            print_error "Failed to publish iac branch"
            exit 1
        fi
    else
        print_error "Failed to create iac branch"
        exit 1
    fi
    
    # Switch back to main branch
    git checkout main
    cd ..
    
    print_success "iac branch creation and publishing completed"
}

# Main execution
main() {
    print_status "Starting deployment automation..."
    print_status "Repository URL: $REPO_URL"
    print_status "S3 Bucket: $S3_BUCKET_NAME"
    print_status "Domain: $DOMAIN"
    print_status "AWS Region: $AWS_REGION"

    # Configure git to use AWS CodeCommit credential helper (for EC2 instance roles)
    git config --global credential.helper '!aws codecommit credential-helper $@'
    git config --global credential.UseHttpPath true

    validate_prerequisites
    get_repo_name "$REPO_URL"
    clone_repository "$REPO_URL"
    
    # Execute deployment steps
    download_docker_files
    create_nginx_config
    setup_nginx_config
    create_route53_records
    generate_ssl_certificates
    update_nginx_with_ssl
    copy_certificates_to_s3
    commit_changes
    update_terraform_folder
    create_iac_branch

    print_success "Deployment automation completed successfully!"
    print_status "Next steps:"
    print_status "1. Update EC2 public IP in Route 53 records"
    print_status "2. Run your Terraform scripts to deploy the infrastructure"
    print_status "3. Set up CodePipeline using your Terraform scripts"
    print_status "4. iac branch has been created and published from main branch"
}

# Run main function
main

# The following line has been disabled to prevent deleting the DNS records immediately after creation.
# delete_route53_records

# Add route53 JSON files to .gitignore if not present
if ! grep -q '^route53-frontend.json$' .gitignore 2>/dev/null; then
    echo 'route53-frontend.json' >> .gitignore
fi
if ! grep -q '^route53-backend.json$' .gitignore 2>/dev/null; then
    echo 'route53-backend.json' >> .gitignore
fi